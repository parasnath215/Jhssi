import { prisma } from './prisma';
import nodemailer from 'nodemailer';
import { logSystemEvent } from './logger';

export type EmailTemplateType =
  | 'SUBMISSION_CONFIRMATION'
  | 'REVISION_REQUESTED'
  | 'REJECTED'
  | 'PUBLISHED'
  | 'TEST';

export interface AuthorNotificationData {
  title: string;
  authorName: string;
  authorEmail: string;
  username?: string;
  articleType?: string;
  manuscriptNo: string;
  comments?: string;
  doi?: string;
  volume?: string;
  issue?: string;
  submissionId?: string;
}

export const DEFAULT_EMAIL_TEMPLATES: Record<EmailTemplateType, { subject: string; body: string }> = {
  SUBMISSION_CONFIRMATION: {
    subject: 'Submission Received: {MANUSCRIPT_NO} - {TITLE}',
    body: `Journal of Humanities and Social Sciences Inventions  
Title: {TITLE}
Authors: {AUTHORS}
Article Type: {ARTICLE_TYPE}

Dear {SALUTATION},

Your submission entitled "{TITLE}" has been received by Journal of Humanities and Social Sciences Inventions. It has been assigned the following manuscript number: {MANUSCRIPT_NO}.

Your username is: {USERNAME}

Thank you for submitting your work to this journal. Please do not hesitate to contact me if you have any queries.

Kind regards,



Journal of Humanities and Social Sciences Inventions  
E-mail: {CONTACT_EMAIL}`,
  },

  REVISION_REQUESTED: {
    subject: 'Revision Required: {MANUSCRIPT_NO} - {TITLE}',
    body: `Journal of Humanities and Social Sciences Inventions  
Title: {TITLE}
Authors: {AUTHORS}
Manuscript No.: {MANUSCRIPT_NO}
Article Type: {ARTICLE_TYPE}

Dear {SALUTATION},

Your submission entitled "{TITLE}" (Manuscript No: {MANUSCRIPT_NO}) has been evaluated by the editorial board and peer reviewers of Journal of Humanities and Social Sciences Inventions.

The reviewers have requested revisions and updates before this manuscript can be further considered for publication.

Editor & Reviewer Comments:
--------------------------------------------------
{COMMENTS}
--------------------------------------------------

Please log in to your author account to review the constructive feedback and submit your revised manuscript (both Marked and Anonymized copies) along with a point-by-point response letter.

Your username is: {USERNAME}

Thank you for submitting your work to this journal. Please do not hesitate to contact us if you have any queries.

Kind regards,



Journal of Humanities and Social Sciences Inventions  
E-mail: {CONTACT_EMAIL}`,
  },

  REJECTED: {
    subject: 'Editorial Decision: {MANUSCRIPT_NO} - {TITLE}',
    body: `Journal of Humanities and Social Sciences Inventions  
Title: {TITLE}
Authors: {AUTHORS}
Manuscript No.: {MANUSCRIPT_NO}

Dear {SALUTATION},

Thank you for submitting your manuscript entitled "{TITLE}" (Manuscript No: {MANUSCRIPT_NO}) to Journal of Humanities and Social Sciences Inventions.

Following thorough evaluation and editorial review, we regret to inform you that we are unable to accept your manuscript for publication in JHSSI in its current form.

Editorial Decision Notes:
--------------------------------------------------
{COMMENTS}
--------------------------------------------------

We appreciate the opportunity to consider your research and wish you the very best in finding a suitable outlet for this work.

Kind regards,



Journal of Humanities and Social Sciences Inventions  
E-mail: {CONTACT_EMAIL}`,
  },

  PUBLISHED: {
    subject: 'Manuscript Published: {MANUSCRIPT_NO} - {TITLE}',
    body: `Journal of Humanities and Social Sciences Inventions  
Title: {TITLE}
Authors: {AUTHORS}
Manuscript No.: {MANUSCRIPT_NO}
DOI: {DOI}
Volume: {VOLUME}, Issue: {ISSUE}

Dear {SALUTATION},

We are pleased to inform you that your manuscript entitled "{TITLE}" (Manuscript No: {MANUSCRIPT_NO}) has been officially published in Journal of Humanities and Social Sciences Inventions.

Your paper is now openly accessible in the journal digital archives.
Permanent DOI: {DOI}
Citation: Vol. {VOLUME}, Issue {ISSUE}

Thank you for choosing JHSSI to publish your academic contribution.

Kind regards,



Journal of Humanities and Social Sciences Inventions  
E-mail: {CONTACT_EMAIL}`,
  },

  TEST: {
    subject: 'Test Notification - JHSSI Editorial System',
    body: `Journal of Humanities and Social Sciences Inventions  

This is a test notification dispatched from the JHSSI Editorial Control Center.

If you received this message, your SMTP mail server and email dispatcher settings are correctly configured and operational.

Timestamp: {TIMESTAMP}
Sender: {SENDER_NAME} <{CONTACT_EMAIL}>

Kind regards,
JHSSI Systems Administration`,
  },
};

/**
 * Generates an academic manuscript number in the format: JHSSI-YY-XXXX
 * Example: JHSSI-26-0001
 */
export async function generateManuscriptNo(): Promise<string> {
  const currentYearFull = new Date().getFullYear();
  const yearCode = currentYearFull.toString().slice(-2); // e.g. "26"
  const prefix = 'JHSSI';
  const counterKey = `manuscript_counter_${yearCode}`;

  let nextSequence = 1;

  try {
    const existingCounter = await prisma.systemSetting.findUnique({
      where: { key: counterKey },
    });

    if (existingCounter && !isNaN(parseInt(existingCounter.value, 10))) {
      nextSequence = parseInt(existingCounter.value, 10) + 1;
    } else {
      // Fallback: check count of existing submissions for this year
      const existingCount = await prisma.submission.count({
        where: {
          manuscriptNo: {
            startsWith: `${prefix}-${yearCode}-`,
          },
        },
      });
      nextSequence = existingCount + 1;
    }

    // Persist updated sequence counter
    await prisma.systemSetting.upsert({
      where: { key: counterKey },
      update: { value: String(nextSequence) },
      create: {
        key: counterKey,
        value: String(nextSequence),
        updatedBy: 'system',
      },
    });
  } catch (error) {
    console.error('Error generating manuscript sequence number:', error);
    const count = await prisma.submission.count();
    nextSequence = count + 1;
  }

  const paddedSeq = String(nextSequence).padStart(4, '0');
  return `${prefix}-${yearCode}-${paddedSeq}`;
}

/**
 * Extracts a polite salutation from an author's name
 * e.g., "Dr. Elena Rostova" -> "Dr. Rostova", "Ripu Sudan Singh" -> "Dr. Singh"
 */
function formatSalutation(fullName: string): string {
  if (!fullName || !fullName.trim()) return 'Author';
  const trimmed = fullName.trim();

  // If already starts with title (Prof., Dr., Mr., Ms.)
  const titleMatch = trimmed.match(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s+(.+)$/i);
  if (titleMatch) {
    const parts = titleMatch[2].trim().split(/\s+/);
    const lastName = parts[parts.length - 1];
    return `${titleMatch[1]} ${lastName}`;
  }

  // Default to Dr. LastName
  const parts = trimmed.split(/\s+/);
  const lastName = parts[parts.length - 1];
  return `Dr. ${lastName}`;
}

/**
 * Loads system-configured email templates or falls back to defaults
 */
export async function getEmailTemplate(type: EmailTemplateType): Promise<{ subject: string; body: string }> {
  try {
    const templateKey = `email_template_${type.toLowerCase()}`;
    const subjectKey = `email_subject_${type.toLowerCase()}`;

    const [bodySetting, subjectSetting] = await Promise.all([
      prisma.systemSetting.findUnique({ where: { key: templateKey } }),
      prisma.systemSetting.findUnique({ where: { key: subjectKey } }),
    ]);

    const defaultTpl = DEFAULT_EMAIL_TEMPLATES[type] || DEFAULT_EMAIL_TEMPLATES.SUBMISSION_CONFIRMATION;

    return {
      subject: subjectSetting?.value || defaultTpl.subject,
      body: bodySetting?.value || defaultTpl.body,
    };
  } catch {
    return DEFAULT_EMAIL_TEMPLATES[type] || DEFAULT_EMAIL_TEMPLATES.SUBMISSION_CONFIRMATION;
  }
}

/**
 * Retrieves SMTP settings from SystemSetting or environment variables
 */
export async function getSmtpSettings() {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            'smtp_host',
            'smtp_port',
            'smtp_user',
            'smtp_pass',
            'smtp_from_name',
            'smtp_from_email',
            'email_notifications_enabled',
          ],
        },
      },
    });

    const configMap: Record<string, string> = {};
    for (const s of settings) {
      configMap[s.key] = s.value;
    }

    return {
      host: configMap['smtp_host'] || process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(configMap['smtp_port'] || process.env.SMTP_PORT || '587', 10),
      user: configMap['smtp_user'] || process.env.SMTP_USER || '',
      pass: configMap['smtp_pass'] || process.env.SMTP_PASS || '',
      fromName: configMap['smtp_from_name'] || 'Journal of Humanities and Social Sciences Inventions',
      fromEmail: configMap['smtp_from_email'] || process.env.SMTP_FROM_EMAIL || 'journalofhssi@gmail.com',
      enabled: configMap['email_notifications_enabled'] !== 'false',
    };
  } catch {
    return {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      fromName: 'Journal of Humanities and Social Sciences Inventions',
      fromEmail: process.env.SMTP_FROM_EMAIL || 'journalofhssi@gmail.com',
      enabled: true,
    };
  }
}

/**
 * Replaces placeholders in email subject and body
 */
export function populatePlaceholders(
  text: string,
  data: AuthorNotificationData,
  contactEmail: string
): string {
  const salutation = formatSalutation(data.authorName);

  return text
    .replace(/{TITLE}/g, data.title || 'Untitled Manuscript')
    .replace(/{AUTHORS}/g, data.authorName || 'Submitting Author')
    .replace(/{AUTHOR_NAME}/g, data.authorName || 'Author')
    .replace(/{SALUTATION}/g, salutation)
    .replace(/{MANUSCRIPT_NO}/g, data.manuscriptNo || 'JHSSI-Pending')
    .replace(/{ARTICLE_TYPE}/g, data.articleType || 'Research Article')
    .replace(/{USERNAME}/g, data.username || data.authorEmail)
    .replace(/{COMMENTS}/g, data.comments || 'No specific reviewer notes provided.')
    .replace(/{DOI}/g, data.doi || 'Pending Assignment')
    .replace(/{VOLUME}/g, data.volume || '6')
    .replace(/{ISSUE}/g, data.issue || '1')
    .replace(/{CONTACT_EMAIL}/g, contactEmail)
    .replace(/{TIMESTAMP}/g, new Date().toLocaleString());
}

/**
 * Formats clean HTML representation of academic email
 */
function createHtmlEmail(bodyText: string, fromName: string): string {
  const formattedBody = bodyText
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<div style="height: 14px;"></div>';
      if (trimmed.startsWith('---')) return '<hr style="border: none; border-top: 1px solid #E6DDCF; margin: 16px 0;" />';
      return `<p style="margin: 0 0 8px 0; color: #3F2A1D; font-size: 14px; line-height: 1.6;">${trimmed}</p>`;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JHSSI Editorial Notification</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F6F1E8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E6DDCF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(63, 42, 29, 0.05);">
    <div style="background: linear-gradient(135deg, #6B4A2E, #3F2A1D); padding: 20px 24px; border-bottom: 3px solid #C8A45D;">
      <h1 style="margin: 0; color: #ffffff; font-size: 18px; font-family: Georgia, serif; font-weight: normal; letter-spacing: 0.5px;">
        Journal of Humanities and Social Sciences Inventions
      </h1>
      <p style="margin: 4px 0 0 0; color: #E6DDCF; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
        ISSN: 2581-8791 (Online) | Double-Blind Peer Reviewed
      </p>
    </div>
    <div style="padding: 28px 24px;">
      ${formattedBody}
    </div>
    <div style="background: #FBF9F5; padding: 16px 24px; border-top: 1px solid #E6DDCF; text-align: center; font-size: 11px; color: #7A6F63;">
      <p style="margin: 0;">This is an automated editorial correspondence sent on behalf of ${fromName}.</p>
      <p style="margin: 4px 0 0 0;">Please address inquiries to the official editorial office.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Dispatches an automated email to an author and logs it to EmailLog & SystemLog
 */
export async function sendAuthorNotification(
  type: EmailTemplateType,
  data: AuthorNotificationData
): Promise<{ success: boolean; status: 'SENT' | 'MOCK_SENT' | 'FAILED'; message: string }> {
  try {
    const smtp = await getSmtpSettings();

    if (!smtp.enabled) {
      console.log(`[Email Dispatcher] Automated notifications are disabled in admin settings.`);
      return { success: true, status: 'MOCK_SENT', message: 'Notifications currently disabled in settings' };
    }

    const template = await getEmailTemplate(type);
    const populatedSubject = populatePlaceholders(template.subject, data, smtp.fromEmail);
    const populatedBody = populatePlaceholders(template.body, data, smtp.fromEmail);
    const htmlBody = createHtmlEmail(populatedBody, smtp.fromName);

    // If SMTP credentials (user and pass) are configured, attempt real delivery
    if (smtp.user && smtp.pass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.port === 465,
          auth: {
            user: smtp.user,
            pass: smtp.pass,
          },
        });

        await transporter.sendMail({
          from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
          to: data.authorEmail,
          replyTo: smtp.fromEmail,
          subject: populatedSubject,
          text: populatedBody,
          html: htmlBody,
        });

        // Record in EmailLog
        await prisma.emailLog.create({
          data: {
            recipient: data.authorEmail,
            recipientName: data.authorName,
            subject: populatedSubject,
            body: populatedBody,
            templateType: type,
            manuscriptNo: data.manuscriptNo,
            submissionId: data.submissionId || null,
            status: 'SENT',
          },
        });

        await logSystemEvent({
          level: 'INFO',
          category: 'SUBMISSION',
          message: `Email dispatched to author (${data.authorEmail}) for ${type} [${data.manuscriptNo}]`,
          details: { recipient: data.authorEmail, subject: populatedSubject, manuscriptNo: data.manuscriptNo },
        });

        return { success: true, status: 'SENT', message: 'Email sent successfully via SMTP' };
      } catch (smtpError: any) {
        console.error('SMTP Delivery error:', smtpError);

        // Record failure in EmailLog
        await prisma.emailLog.create({
          data: {
            recipient: data.authorEmail,
            recipientName: data.authorName,
            subject: populatedSubject,
            body: populatedBody,
            templateType: type,
            manuscriptNo: data.manuscriptNo,
            submissionId: data.submissionId || null,
            status: 'FAILED',
            errorMessage: smtpError?.message || 'SMTP delivery failed',
          },
        });

        await logSystemEvent({
          level: 'ERROR',
          category: 'SYSTEM',
          message: `Failed to deliver email to ${data.authorEmail}: ${smtpError?.message}`,
          details: { error: smtpError?.message, recipient: data.authorEmail, manuscriptNo: data.manuscriptNo },
        });

        return { success: false, status: 'FAILED', message: `SMTP error: ${smtpError?.message}` };
      }
    }

    // Fallback: SMTP credentials not set yet -> safely log to EmailLog as MOCK_SENT
    console.log(`\n======================================================`);
    console.log(`[JHSSI Email Notification (Simulated Delivery)]`);
    console.log(`To: ${data.authorName} <${data.authorEmail}>`);
    console.log(`Subject: ${populatedSubject}`);
    console.log(`Manuscript No: ${data.manuscriptNo}`);
    console.log(`Body:\n${populatedBody}`);
    console.log(`======================================================\n`);

    await prisma.emailLog.create({
      data: {
        recipient: data.authorEmail,
        recipientName: data.authorName,
        subject: populatedSubject,
        body: populatedBody,
        templateType: type,
        manuscriptNo: data.manuscriptNo,
        submissionId: data.submissionId || null,
        status: 'MOCK_SENT',
        errorMessage: 'SMTP credentials not configured. Recorded to database and console.',
      },
    });

    await logSystemEvent({
      level: 'INFO',
      category: 'SUBMISSION',
      message: `Simulated author notification logged: ${type} for ${data.manuscriptNo} (${data.authorEmail})`,
      details: { recipient: data.authorEmail, subject: populatedSubject, manuscriptNo: data.manuscriptNo },
    });

    return {
      success: true,
      status: 'MOCK_SENT',
      message: 'SMTP credentials not configured. Notification recorded to database logs.',
    };
  } catch (error: any) {
    console.error('Notification dispatch error:', error);
    return { success: false, status: 'FAILED', message: error?.message || 'Unknown error' };
  }
}
