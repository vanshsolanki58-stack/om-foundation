import { VolunteerFormData } from '../types/volunteer';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
}

const ADMIN_EMAIL = 'vansh.solanki58@gmail.com';

/**
 * Dispatches volunteer registration details to admin (vansh.solanki58@gmail.com)
 * AND sends a personalized Thank You email to the volunteer (if email provided).
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

  // 1. Admin Notification Payload
  const adminPayload = {
    _subject: `New Volunteer Registration: ${data.fullName} (${volunteerId}) - Om Foundation`,
    _template: 'table',
    _captcha: 'false',
    "Volunteer ID": volunteerId,
    "Full Name": data.fullName,
    "WhatsApp Phone": data.phone,
    "Email": data.email || "Not provided",
    "City / Location": data.city,
    "Roles Selected": roleList,
    "Seva Availability": availList,
    "Age Bracket": data.ageGroup,
    "WhatsApp Seva Updates": data.whatsappUpdatesOptIn !== false ? "YES (Opted In)" : "NO",
    "Emergency Relief Team": data.emergencyReliefOptIn ? "YES (WhatsApp Alert)" : "NO",
    "Prior Experience / Message": data.message || "None",
    "Submission Time": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  try {
    // Send to Admin
    const adminPromise = fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(adminPayload),
    }).catch((err) => console.warn('[Email Service] Admin email error:', err));

    // 2. If Volunteer provided their email, send them a Sacred Thank You Email
    let volunteerPromise = Promise.resolve();
    if (data.email && data.email.includes('@')) {
      const thankYouPayload = {
        _subject: `Dhanyawaad & Welcome to Om Foundation! 🙏 (Volunteer ID: ${volunteerId})`,
        _template: 'box',
        _captcha: 'false',
        "Welcome": `Dear ${data.fullName}, Dhanyawaad for joining Om Charitable Trust (ॐ चैरीटेबल ट्रस्ट)!`,
        "Your Volunteer ID": volunteerId,
        "Registered Name": data.fullName,
        "Location": data.city,
        "Seva Areas": roleList,
        "Availability": availList,
        "WhatsApp Updates": data.whatsappUpdatesOptIn !== false ? "Active - You will receive seva reminders & shibir dates" : "Off",
        "Weekly Seva Schedule": "• Friday Evening Meals: 6:00 PM | • Sunday Breakfast: 8:30 AM | • Shibirs: Announced on WhatsApp",
        "Seva Center Address": "SHRI STUTI, MES Road, Madhapar, Bhuj, Gujarat, India",
        "Helpline / Contact": "+91 98765 43210 / info@omfoundation.org",
        "Blessing": "तेज से तेजोमय • May your seva bring nourishment and peace to all souls.",
      };

      volunteerPromise = fetch(`https://formsubmit.co/ajax/${data.email.trim()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(thankYouPayload),
      }).then(() => {
        console.log(`[Email Service] Thank you email dispatched to volunteer: ${data.email}`);
      }).catch((err) => console.warn('[Email Service] Volunteer thank you email error:', err));
    }

    await Promise.all([adminPromise, volunteerPromise]);

    return {
      success: true,
      message: `Registration confirmed! A thank-you email has been sent.`,
    };
  } catch (err: any) {
    console.error('[Email Service] Error in email dispatch:', err);
    return {
      success: true,
      message: 'Volunteer saved successfully.',
    };
  }
}
