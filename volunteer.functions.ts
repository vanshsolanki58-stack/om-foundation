import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const volunteerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email").optional(),
  phone: z.string().min(5, "Phone number is required"),
  interest: z.string().optional(),
});

export const submitVolunteerForm = createServerFn({ method: "POST" })
  .inputValidator((data) => volunteerSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("volunteer_submissions").insert({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone,
      interest: data.interest ?? null,
    });

    if (error) {
      console.error("Volunteer submission error:", error);
      throw new Error("Failed to submit volunteer application. Please try again later.");
    }

    return { success: true };
  });
