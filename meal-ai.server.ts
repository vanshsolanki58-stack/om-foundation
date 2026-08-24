type PhotoInput = { fileName: string; contentType: string; dataBase64: string };

export type PhotoReview = {
  fileName: string;
  isOriginal: boolean;
  isMealBeingServed: boolean;
  countsTowardMeals: boolean;
  reason: string;
  recipients: { signature: string; description: string }[];
};

const SYSTEM_PROMPT = `You review photographs submitted by a charity that distributes free meals.
For each photo answer strictly as JSON:
{
  "is_original": boolean,          // true if it looks like a genuine, unedited camera photograph. false if it looks AI-generated, a screenshot, a photo of a screen, a stock image, or heavily manipulated.
  "meal_being_served": boolean,    // true ONLY if food/meal is actually being handed over, served, plated or eaten by a recipient in this photo. A posed group photo, a portrait, a photo of an empty hall, banners, or people just standing together is false.
  "reason": "short sentence explaining the decision",
  "recipients": [                  // one entry per DISTINCT person visibly receiving or eating a meal (skip volunteers/servers). Empty array if meal_being_served is false.
    { "description": "stable visual description: approximate age, gender, clothing colour and pattern, distinguishing features" }
  ]
}
Be conservative: if you are unsure whether a meal is being served, answer false.
Return JSON only, no markdown fences.`;

function normalizeSignature(description: string) {
  return description
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .sort()
    .slice(0, 14)
    .join("-");
}

export async function reviewPhoto(photo: PhotoInput): Promise<PhotoReview> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Photo review is not configured.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.6-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Review this meal distribution photo." },
            {
              type: "image_url",
              image_url: { url: `data:${photo.contentType};base64,${photo.dataBase64}` },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const status = res.status;
    if (status === 429) throw new Error("Photo review is rate limited. Please try again shortly.");
    if (status === 402) throw new Error("Photo review credits are exhausted.");
    throw new Error("Photo review failed. Please try again.");
  }

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = json.choices?.[0]?.message?.content ?? "";
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  let parsed: {
    is_original?: boolean;
    meal_being_served?: boolean;
    reason?: string;
    recipients?: { description?: string }[];
  };
  try {
    parsed = JSON.parse(cleaned.slice(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));
  } catch {
    throw new Error("Photo review returned an unreadable result. Please try again.");
  }

  const isOriginal = parsed.is_original !== false;
  const isMealBeingServed = parsed.meal_being_served === true;
  const recipients = (parsed.recipients ?? [])
    .map((r) => (r.description ?? "").trim())
    .filter((d) => d.length > 3)
    .map((description) => ({ description, signature: normalizeSignature(description) }))
    .filter((r) => r.signature.length > 0);

  const unique = new Map(recipients.map((r) => [r.signature, r]));

  return {
    fileName: photo.fileName,
    isOriginal,
    isMealBeingServed,
    countsTowardMeals: isOriginal && isMealBeingServed && unique.size > 0,
    reason:
      parsed.reason?.trim() ||
      (isMealBeingServed ? "Meal distribution detected." : "No meal being served in this photo."),
    recipients: [...unique.values()],
  };
}

export async function reviewPhotos(photos: PhotoInput[]) {
  const out: PhotoReview[] = [];
  for (const photo of photos) out.push(await reviewPhoto(photo));
  return out;
}
