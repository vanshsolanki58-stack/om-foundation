import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const apiKey = process.env["GEMINI_API_KEY"] || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  let raw = "";
  try {
    const result = await model.generateContent([
      {
        text: "Review this meal distribution photo.",
      },
      {
        inlineData: {
          mimeType: photo.contentType || "image/jpeg",
          data: photo.dataBase64,
        },
      },
    ]);

    raw = result.response.text();
  } catch (err: any) {
    const errMsg = String(err?.message || err);
    if (err?.status === 429 || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
      throw new Error("Photo review rate limit or quota exceeded. Please try again in a few moments.");
    }
    if (err?.status === 400 || errMsg.includes("API_KEY_INVALID") || errMsg.includes("API key not valid")) {
      throw new Error("Invalid Gemini API key. Please check your GEMINI_API_KEY configuration.");
    }
    throw new Error(`Photo review failed: ${err.message || "Unknown error during AI review."}`);
  }

  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  let parsed: {
    is_original?: boolean;
    meal_being_served?: boolean;
    reason?: string;
    recipients?: { description?: string }[];
  };

  try {
    const startIdx = cleaned.indexOf("{");
    const endIdx = cleaned.lastIndexOf("}");
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("No JSON object found");
    }
    parsed = JSON.parse(cleaned.slice(startIdx, endIdx + 1));
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
  for (const photo of photos) {
    out.push(await reviewPhoto(photo));
  }
  return out;
}
