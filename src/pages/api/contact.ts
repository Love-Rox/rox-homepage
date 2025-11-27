import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

// Verify Turnstile token
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return false;
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// Create email transporter
function createTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    throw new Error('Gmail credentials are not configured');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });
}

// Send email to admin
async function sendAdminNotification(
  transporter: nodemailer.Transporter,
  formData: ContactFormData
) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'dev@love-rox.cc',
    subject: `[Contact Form] ${formData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
        </div>
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${formData.message}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This email was sent from the Rox contact form.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Send confirmation email to sender
async function sendConfirmationEmail(
  transporter: nodemailer.Transporter,
  formData: ContactFormData
) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: formData.email,
    subject: 'Thank you for contacting Rox',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Thank you for contacting us!</h2>
        <p>Dear ${formData.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your message:</h3>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <p style="white-space: pre-wrap; margin-top: 10px;">${formData.message}</p>
        </div>
        
        <p>Best regards,<br>The Rox Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated confirmation email. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message || !body.turnstileToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(body.turnstileToken);
    if (!isValidToken) {
      return new Response(
        JSON.stringify({ error: 'Invalid security token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create email transporter
    const transporter = createTransporter();

    // Send both emails
    await Promise.all([
      sendAdminNotification(transporter, body),
      sendConfirmationEmail(transporter, body),
    ]);

    return new Response(
      JSON.stringify({ success: true, message: 'Emails sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
