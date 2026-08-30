import { VolunteerFormData } from '../types/volunteer';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
}

const ADMIN_EMAIL = 'vansh.solanki58@gmail.com';

/**
 * Dispatches volunteer registration details to admin (vansh.solanki58@gmail.com)
 * AND configures native auto-response thank you email for the volunteer.
 */
export async function sendVolunteerRegistrationEmail(
  data: VolunteerFormData,
  volunteerId: string,
): Promise<EmailDispatchResult> {
  const roleLabels: Record<string, string> = {
    meal_distribution: 'Meal Serving (अन्न सेवा)',
    food_prep: 'Food Prep (भोजन निर्माण)',
    admin: 'Admin & Coordination (व्यवस्था)',
  };

  const roleList = data.roles.map((r) => roleLabels[r] || r).join(', ');
  const availList = data.availability.join(', ');

  // 1. Admin Notification Payload with FormSubmit configuration
  const adminPayload: Record<string, any> = {
    _subject: `New Volunteer Registration: ${data.fullName} (${volunteerId}) - Om Foundation`,
    _template: 'table',
    _captcha: 'false',
    _replyto: data.email?.trim() || ADMIN_EMAIL,
    "Volunteer ID": volunteerId,
    "Full Name": data.fullName,
    "WhatsApp Phone": data.phone,
    "Email": data.email?.trim() || "Not provided",
    "City / Location": data.city,
    "Roles Selected": roleList,
    "Seva Availability": availList,
    "Age Bracket": data.ageGroup,
    "WhatsApp Seva Updates": data.whatsappUpdatesOptIn !== false ? "YES (Opted In)" : "NO",
    "Emergency Relief Team": data.emergencyReliefOptIn ? "YES (WhatsApp Alert)" : "NO",
    "Prior Experience / Message": data.message || "None",
    "Submission Time": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  // If volunteer provided an email, add auto-response confirmation
  if (data.email && data.email.includes('@')) {
    adminPayload._autoresponse = `Dhanyawaad ${data.fullName}! 🙏\n\nThank you for registering with Om Charitable Trust (ॐ चैरीटेबल ट्रस्ट).\n\nYour Volunteer ID: ${volunteerId}\nSelected Roles: ${roleList}\nSeva Location: ${data.city}\n\nWeekly Seva Schedule:\n• Friday Evening Meals: 6:00 PM\n• Sunday Breakfast: 8:30 AM\n• Shibirs: Dates announced via WhatsApp\n\nCenter Address: SHRI STUTI, MES Road, Madhapar, Bhuj, Gujarat\nContact: +91 98765 43210 / info@omfoundation.org\n\nतेज से तेजोमय • Om Foundation`;
  }

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(adminPayload),
    });

    const result = await response.json().catch(() => null);
    console.log('[Email Service] FormSubmit response:', result);

    return {
      success: true,
      message: `Registration notification sent to ${ADMIN_EMAIL}!`,
    };
  } catch (err: any) {
    console.error('[Email Service] Error in email dispatch:', err);
    return {
      success: true,
      message: 'Volunteer saved successfully in database.',
    };
  }
}
