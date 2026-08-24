import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export function getPublicSupabase() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const MEAL_BUCKET = "meal-photos";

export async function signPaths(paths: string[]) {
  if (paths.length === 0) return new Map<string, string>();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.storage
    .from(MEAL_BUCKET)
    .createSignedUrls(paths, 60 * 60);
  if (error || !data) return new Map<string, string>();
  const map = new Map<string, string>();
  for (const item of data) {
    if (item.path && item.signedUrl) map.set(item.path, item.signedUrl);
  }
  return map;
}

export function checkPasscode(input: string) {
  const expected = process.env["GALLERY_ADMIN_PASSCODE"];
  if (!expected) throw new Error("Upload passcode is not configured.");
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function decodeBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

type PhotoInput = { fileName: string; contentType: string; dataBase64: string };

export async function storePhotos(
  dayId: string,
  servedOn: string,
  photos: PhotoInput[],
  caption: string | null,
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { reviewPhoto } = await import("@/lib/meal-ai.server");
  const { mirrorPhotoToDrive } = await import("@/lib/drive.server");

  const reviews: { fileName: string; reason: string; counted: number; countsTowardMeals: boolean }[] = [];

  for (const photo of photos) {
    const review = await reviewPhoto(photo);

    const ext = photo.fileName.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${servedOn}/${crypto.randomUUID()}.${ext}`;
    const bytes = decodeBase64(photo.dataBase64);
    const { error: uploadError } = await supabaseAdmin.storage
      .from(MEAL_BUCKET)
      .upload(path, bytes, { contentType: photo.contentType });
    if (uploadError) throw new Error("Could not upload one of the photos.");

    // Backup copy in the foundation's Google Drive (best effort).
    const drive = await mirrorPhotoToDrive({
      servedOn,
      fileName: photo.fileName,
      contentType: photo.contentType,
      bytes,
    });

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("meal_photos")
      .insert({
        day_id: dayId,
        image_path: path,
        caption,
        ai_is_original: review.isOriginal,
        ai_meal_being_served: review.isMealBeingServed,
        ai_reason: review.reason,
        counts_toward_meals: review.countsTowardMeals,
        counted_recipients: 0,
        drive_file_id: drive?.fileId ?? null,
        drive_link: drive?.link ?? null,
      })
      .select("id")
      .single();
    if (insertError || !inserted) throw new Error("Could not save one of the photos.");


    let counted = 0;
    if (review.countsTowardMeals) {
      for (const recipient of review.recipients) {
        const { data: existing } = await supabaseAdmin
          .from("meal_recipients")
          .select("id")
          .eq("signature", recipient.signature)
          .maybeSingle();
        if (existing) continue;
        const { error: recipientError } = await supabaseAdmin.from("meal_recipients").insert({
          signature: recipient.signature,
          description: recipient.description,
          first_photo_id: inserted.id,
          first_served_on: servedOn,
        });
        if (!recipientError) counted += 1;
      }
      if (counted > 0) {
        await supabaseAdmin
          .from("meal_photos")
          .update({ counted_recipients: counted })
          .eq("id", inserted.id);
      }
    }

    reviews.push({
      fileName: photo.fileName,
      reason: review.reason,
      counted,
      countsTowardMeals: review.countsTowardMeals,
    });
  }

  await recalcMealsServed(dayId);
  return reviews;
}

export async function recalcMealsServed(dayId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("meal_photos")
    .select("counted_recipients")
    .eq("day_id", dayId);
  const total = (data ?? []).reduce((sum, p) => sum + (p.counted_recipients ?? 0), 0);
  await supabaseAdmin.from("meal_days").update({ meals_served: total }).eq("id", dayId);
  return total;
}

export async function removePhotosForDay(dayId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { deleteDriveFile } = await import("@/lib/drive.server");
  const { data: photos, error } = await supabaseAdmin
    .from("meal_photos")
    .select("id, image_path, drive_file_id")
    .eq("day_id", dayId);
  if (error) throw new Error("Could not load the photos for this date.");
  const paths = (photos ?? []).map((p) => p.image_path);
  if (paths.length > 0) {
    await supabaseAdmin.storage.from(MEAL_BUCKET).remove(paths);
    for (const p of photos ?? []) {
      if (p.drive_file_id) await deleteDriveFile(p.drive_file_id);
    }
    await supabaseAdmin
      .from("meal_recipients")
      .delete()
      .in("first_photo_id", (photos ?? []).map((p) => p.id));
    const { error: delError } = await supabaseAdmin.from("meal_photos").delete().eq("day_id", dayId);
    if (delError) throw new Error("Could not delete the photos for this date.");
  }
  return paths.length;
}



function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function buildMealAuditCsv(): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: days, error: daysError } = await supabaseAdmin
    .from("meal_days")
    .select("id, served_on, meals_served, notes")
    .order("served_on", { ascending: false });
  if (daysError) throw new Error("Could not load the meal days.");

  const { data: photos, error: photosError } = await supabaseAdmin
    .from("meal_photos")
    .select(
      "id, day_id, image_path, caption, counts_toward_meals, counted_recipients, ai_reason, ai_is_original, ai_meal_being_served, drive_link, created_at",
    )
    .order("created_at", { ascending: true });
  if (photosError) throw new Error("Could not load the meal photos.");

  const header = [
    "served_on",
    "day_meals_served",
    "day_notes",
    "photo_id",
    "photo_caption",
    "counts_toward_meals",
    "counted_recipients",
    "ai_is_original",
    "ai_meal_being_served",
    "ai_reason",
    "drive_link",
    "uploaded_at",
  ];

  const rows: string[] = [header.map(csvCell).join(",")];
  for (const day of days ?? []) {
    const dayPhotos = (photos ?? []).filter((p) => p.day_id === day.id);
    if (dayPhotos.length === 0) {
      rows.push(
        [day.served_on, day.meals_served, day.notes, "", "", "", "", "", "", "no photos uploaded", "", ""]
          .map(csvCell)
          .join(","),
      );
      continue;
    }
    for (const p of dayPhotos) {
      rows.push(
        [
          day.served_on,
          day.meals_served,
          day.notes,
          p.id,
          p.caption,
          p.counts_toward_meals,
          p.counted_recipients,
          p.ai_is_original,
          p.ai_meal_being_served,
          p.ai_reason,
          p.drive_link,
          p.created_at,
        ]
          .map(csvCell)
          .join(","),
      );
    }
  }
  return rows.join("\n");
}
