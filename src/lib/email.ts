import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(to: string, name: string, tempPassword: string, role: string) {
  const loginUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const roleName = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #140342;">
      <h2 style="color: #6440FB; margin-bottom: 20px;">Welcome to LearnzLab LMS!</h2>
      <p style="font-size: 16px; margin-bottom: 10px;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 16px; margin-bottom: 20px;">An administrator has registered an account for you as a <strong>${roleName}</strong>.</p>
      
      <div style="background-color: #f8f9fc; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">Your Login Credentials:</p>
        <p style="margin: 0 0 5px 0;"><strong>Email:</strong> ${to}</p>
        <p style="margin: 0;"><strong>Password:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></p>
      </div>

      <a href="${loginUrl}/login" style="display: inline-block; background-color: #6440FB; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-bottom: 20px;">
        Login to Your Account
      </a>

      <p style="font-size: 14px; color: #64748b;">For security reasons, we strongly recommend changing your password after your first login.</p>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; ${new Date().getFullYear()} LearnzLab. All rights reserved.</p>
    </div>
  `;

  // If SMTP is configured in .env
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"LearnzLab" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to,
        subject: 'Welcome to LearnzLab - Your Login Credentials',
        html,
      });
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send email via SMTP:', error);
    }
  } else {
    // Development fallback
    console.log('--- DEVELOPMENT MODE: EMAIL INTERCEPTED ---');
    console.log(`To: ${to}`);
    console.log(`Subject: Welcome to LearnzLab - Your Login Credentials`);
    console.log(`Password included: ${tempPassword}`);
    console.log('---------------------------------------------');
    console.log('To send real emails, set SMTP_HOST, SMTP_USER, SMTP_PASS in .env');
  }
}
