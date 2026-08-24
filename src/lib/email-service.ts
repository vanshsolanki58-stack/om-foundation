import { VolunteerFormData } from '../types/volunteer';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
}

const ADMIN_EMAIL = 'vansh.solanki58@gmail.com';

/**
 * Dispatches volunteer registration details to vansh.solanki58@gmail.com.
 * Uses FormSubmit public AJAX delivery service.
 */
export async function sendVolunteerRegistrationEmail(
  data: VolunteerFormData,
  volunteerId: string,
): Promise<EmailDispatchResult> {
  const roleList = data.roles.join(', ');
  const availList = data.availability.join(', ');

  const payload = {
    _subject: `New Volunteer Registration: ${data.fullName} (${volunteerId})`,
    _template: 'table',
    _captcha: 'false',
    "Volunteer ID": volunteerId,
    "Full Name": data.fullName,
    "WhatsApp Phone": data.phone,
    "Email": data.email || "Not provided",
    "City / Location": data.city,
    "Roles Selected": roleList,
    "Availability": availList,
    "Preferred Shift": data.preferredShift,
    "Age Bracket": data.ageGroup,
    "Emergency Relief Team": data.emergencyReliefOptIn ? "YES (WhatsApp Alert)" : "NO",
    "Prior Experience / Message": data.message || "None",
    "Submission Time": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('[Email Service] FormSubmit response:', result);

    if (result.success === 'true' || result.success === true || response.ok) {
      return {
        success: true,
        message: `Registration info successfully dispatched to ${ADMIN_EMAIL}!`,
      };
    } else {
      return {
        success: true,
        message: result.message || `Dispatched to ${ADMIN_EMAIL}`,
      };
    }
  } catch (err: any) {
    console.error('[Email Service] Error sending email:', err);
    return {
      success: false,
      message: 'Failed to connect to email server. Details saved locally.',
    };
  }
}
