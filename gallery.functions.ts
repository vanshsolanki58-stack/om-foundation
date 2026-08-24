import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const uploadSchema = z.object({
  passcode: z.string().min(1, "Passcode is required"),
  servedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date"),
  caption: z.string().max(200).optional(),
  photos: z
    .array(
      z.object({
        fileName: z.string().min(1),
        contentType: z.string().regex(/^image\//, "Only images are allowed"),
        dataBase64: z.string().min(1),
      }),
    )
    .min(1, "Add at least one photo")
    .max(12, "Up to 12 photos at a time"),
});

export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicSupabase, signPaths } = await import("@/lib/gallery.server");
  const supabase = getPublicSupabase();

  const { data: days, error: daysError } = await supabase
    .from("meal_days")
    .select("id, served_on, meals_served, notes")
    .order("served_on", { ascending: false });
  if (daysError) throw new Error("Could not load the meal gallery.");

  const { data: photos, error: photosError } = await supabase
    .from("meal_photos")
    .select("id, day_id, image_path, caption")
    .order("created_at", { ascending: true });
  if (photosError) throw new Error("Could not load the meal gallery.");

  const signed = await signPaths((photos ?? []).map((p) => p.image_path));

  const daysWithPhotos = (days ?? [])
    .map((day) => ({
      id: day.id,
      servedOn: day.served_on,
      mealsServed: day.meals_served,
      notes: day.notes,
      photos: (photos ?? [])
        .filter((p) => p.day_id === day.id)
        .map((p) => ({
          id: p.id,
          caption: p.caption,
          url: signed.get(p.image_path) ?? null,
        }))
        .filter((p) => p.url !== null) as { id: string; caption: string | null; url: string }[],
    }))
    .filter((day) => day.photos.length > 0);

  return {
    days: daysWithPhotos,
    totalMeals: daysWithPhotos.reduce((sum, d) => sum + d.mealsServed, 0),
    totalPhotos: daysWithPhotos.reduce((sum, d) => sum + d.photos.length, 0),
  };
});

export const uploadMealPhotos = createServerFn({ method: "POST" })
  .inputValidator((data) => uploadSchema.parse(data))
  .handler(async ({ data }) => {
    const { checkPasscode, storePhotos } = await import("@/lib/gallery.server");
    if (!checkPasscode(data.passcode)) {
      return { success: false as const, message: "Incorrect passcode.", reviews: [], mealsServed: 0 };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: day, error: dayError } = await supabaseAdmin
      .from("meal_days")
      .upsert({ served_on: data.servedOn, notes: data.caption ?? null }, { onConflict: "served_on" })
      .select("id")
      .single();
    if (dayError || !day) throw new Error("Could not save this meal day.");

    const reviews = await storePhotos(day.id, data.servedOn, data.photos, data.caption ?? null);

    const { data: updated } = await supabaseAdmin
      .from("meal_days")
      .select("meals_served")
      .eq("id", day.id)
      .maybeSingle();

    const counted = reviews.reduce((sum, r) => sum + r.counted, 0);
    return {
      success: true as const,
      message: `Uploaded ${data.photos.length} photo(s); ${counted} new meal(s) counted.`,
      reviews,
      mealsServed: updated?.meals_served ?? 0,
    };
  });

const photoSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().regex(/^image\//, "Only images are allowed"),
  dataBase64: z.string().min(1),
});

const adminListSchema = z.object({ passcode: z.string().min(1) });

const updateDaySchema = z.object({
  passcode: z.string().min(1),
  dayId: z.string().uuid(),
  notes: z.string().max(200).optional(),
});

const deleteDaySchema = z.object({ passcode: z.string().min(1), dayId: z.string().uuid() });

const deletePhotoSchema = z.object({ passcode: z.string().min(1), photoId: z.string().uuid() });

const replaceSchema = z.object({
  passcode: z.string().min(1),
  dayId: z.string().uuid(),
  caption: z.string().max(200).optional(),
  photos: z.array(photoSchema).min(1, "Add at least one photo").max(12, "Up to 12 photos at a time"),
});

export const listMealDaysAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) => adminListSchema.parse(data))
  .handler(async ({ data }) => {
    const { checkPasscode, signPaths } = await import("@/lib/gallery.server");
    if (!checkPasscode(data.passcode)) {
      return { success: false as const, message: "Incorrect passcode.", days: [] };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: days, error: daysError } = await supabaseAdmin
      .from("meal_days")
      .select("id, served_on, meals_served, notes")
      .order("served_on", { ascending: false });
    if (daysError) throw new Error("Could not load the meal days.");

    const { data: photos, error: photosError } = await supabaseAdmin
      .from("meal_photos")
      .select(
        "id, day_id, image_path, caption, counts_toward_meals, counted_recipients, ai_reason, ai_is_original, ai_meal_being_served, drive_link",
      )
      .order("created_at", { ascending: true });
    if (photosError) throw new Error("Could not load the meal photos.");

    const signed = await signPaths((photos ?? []).map((p) => p.image_path));

    return {
      success: true as const,
      message: "",
      days: (days ?? []).map((day) => ({
        id: day.id,
        servedOn: day.served_on,
        mealsServed: day.meals_served,
        notes: day.notes,
        photos: (photos ?? [])
          .filter((p) => p.day_id === day.id)
          .map((p) => ({
            id: p.id,
            caption: p.caption,
            url: signed.get(p.image_path) ?? null,
            countsTowardMeals: p.counts_toward_meals,
            countedRecipients: p.counted_recipients,
            aiReason: p.ai_reason,
            aiIsOriginal: p.ai_is_original,
            aiMealBeingServed: p.ai_meal_being_served,
            driveLink: p.drive_link,
          })),
      })),
    };

  });

export const updateMealDay = createServerFn({ method: "POST" })
  .inputValidator((data) => updateDaySchema.parse(data))
  .handler(async ({ data }) => {
    const { checkPasscode, recalcMealsServed } = await import("@/lib/gallery.server");
    if (!checkPasscode(data.passcode)) return { success: false as const, message: "Incorrect passcode." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("meal_days")
      .update({ notes: data.notes ?? null })
      .eq("id", data.dayId);
    if (error) throw new Error("Could not update this date.");
    await recalcMealsServed(data.dayId);
    return { success: true as const, message: "Date updated." };
  });

export const deleteMealPhoto = createServerFn({ method: "POST" })
  .inputValidator((data) => deletePhotoSchema.parse(data))
  .handler(async ({ data }) => {
    const { checkPasscode, MEAL_BUCKET, recalcMealsServed } = await import("@/lib/gallery.server");
    if (!checkPasscode(data.passcode)) return { success: false as const, message: "Incorrect passcode." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: photo, error } = await supabaseAdmin
      .from("meal_photos")
      .select("id, image_path, day_id, drive_file_id")
      .eq("id", data.photoId)
      .maybeSingle();
    if (error) throw new Error("Could not find this photo.");
    if (!photo) return { success: false as const, message: "Photo no longer exists." };
    await supabaseAdmin.storage.from(MEAL_BUCKET).remove([photo.image_path]);
    if (photo.drive_file_id) {
      const { deleteDriveFile } = await import("@/lib/drive.server");
      await deleteDriveFile(photo.drive_file_id);
    }
    await supabaseAdmin.from("meal_recipients").delete().eq("first_photo_id", photo.id);
    const { error: delError } = await supabaseAdmin.from("meal_photos").delete().eq("id", photo.id);
    if (delError) throw new Error("Could not delete this photo.");
    await recalcMealsServed(photo.day_id);
    return { success: true as const, message: "Photo deleted." };
  });


export const deleteMealDay = createServerFn({ method: "POST" })
  .inputValidator((data) => deleteDaySchema.parse(data))
  .handler(async ({ data }) => {
    const { checkPasscode, removePhotosForDay } = await import("@/lib/gallery.server");
    if (!checkPasscode(data.passcode)) return { success: false as const, message: "Incorrect passcode." };
    await removePhotosForDay(data.dayId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("meal_days").delete().eq("id", data.dayId);
    if (error) throw new Error("Could not delete this date.");
    return { success: true as const, message: "Date and its photos deleted." };
  });

export const replaceMealPhotos = createServerFn({ method: "POST" })
  .inputValidator((data) => replaceSchema.parse(data))
  .handler(async ({ data }) => {
    const { checkPasscode, removePhotosForDay, storePhotos } = await import("@/lib/gallery.server");
    if (!checkPasscode(data.passcode)) return { success: false as const, message: "Incorrect passcode." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: day, error } = await supabaseAdmin
      .from("meal_days")
      .select("id, served_on")
      .eq("id", data.dayId)
      .maybeSingle();
    if (error) throw new Error("Could not load this date.");
    if (!day) return { success: false as const, message: "This date no longer exists." };

    await removePhotosForDay(day.id);
    await storePhotos(day.id, day.served_on, data.photos, data.caption ?? null);
    return { success: true as const, message: `Replaced with ${data.photos.length} photo(s).` };
  });

export const exportMealAudit = createServerFn({ method: "POST" })
  .inputValidator((data) => adminListSchema.parse(data))
  .handler(async ({ data }) => {
    const { checkPasscode, buildMealAuditCsv } = await import("@/lib/gallery.server");
    if (!checkPasscode(data.passcode)) {
      return { success: false as const, message: "Incorrect passcode.", csv: "" };
    }
    const csv = await buildMealAuditCsv();
    return { success: true as const, message: "", csv };
  });
