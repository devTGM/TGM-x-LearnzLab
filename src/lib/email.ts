import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(to: string, name: string, tempPassword: string, role: string) {
  const loginUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const roleName = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  const isStudent = role === 'STUDENT';
  
  const studentHtml = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #140342; line-height: 1.6;">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Welcome to <strong style="color: #6440FB;">LearnzLab Academy</strong>!</p>
      <p>We're excited to have you as a part of our learning community. Your registration has been successfully completed, and you now have access to our Learning Management System (LMS).</p>
      
      <h3 style="color: #6440FB; margin-top: 25px;">Your Account Details</h3>
      <ul style="list-style-type: none; padding-left: 0; background-color: #f8f9fc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <li style="margin-bottom: 8px;"><strong>Portal:</strong> <a href="https://study.learnzlab.com" style="color: #6440FB;">https://study.learnzlab.com</a></li>
        <li style="margin-bottom: 8px;"><strong>Username/Email:</strong> ${to}</li>
        <li><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></li>
      </ul>
      
      <p>Once you log in, we recommend changing your password for security purposes.</p>

      <h3 style="color: #6440FB; margin-top: 25px;">What's Next?</h3>
      <ul style="padding-left: 20px; margin-bottom: 25px;">
        <li>Complete your profile.</li>
        <li>Explore your enrolled course(s).</li>
        <li>Access learning modules, assignments, quizzes, and downloadable resources.</li>
        <li>Track your learning progress through your personalised dashboard.</li>
        <li>Connect with your trainers and support team whenever you need assistance.</li>
      </ul>

      <p>Our mission is to equip you with industry-relevant skills through practical learning, live projects, and expert mentorship.</p>
      <p>If you need any assistance, feel free to reach out to our support team at <a href="mailto:support@learnzlab.com" style="color: #6440FB; font-weight: 600;">support@learnzlab.com</a>.</p>
      <p>We wish you an enriching learning experience and look forward to celebrating your success.</p>
      <p>Welcome aboard!</p>
      <br/>
      <p style="margin: 0;">Warm Regards,</p>
      <p style="margin: 5px 0 0 0;"><strong>Team LearnzLab Academy</strong></p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Email: <a href="mailto:support@learnzlab.com" style="color: #6440FB;">support@learnzlab.com</a></p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Website: <a href="http://www.learnzlab.com" style="color: #6440FB;">www.learnzlab.com</a></p>
    </div>
  `;

  const trainerHtml = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #140342; line-height: 1.6;">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Welcome to <strong style="color: #6440FB;">LearnzLab Academy</strong>!</p>
      <p>We are delighted to have you join us as a Trainer. Your expertise and guidance will play a vital role in helping learners achieve their professional goals.</p>
      <p>Your trainer account has been successfully created on our Learning Management System (LMS).</p>
      
      <h3 style="color: #6440FB; margin-top: 25px;">Your Account Details</h3>
      <ul style="list-style-type: none; padding-left: 0; background-color: #f8f9fc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <li style="margin-bottom: 8px;"><strong>Trainer Portal:</strong> <a href="https://study.learnzlab.com" style="color: #6440FB;">https://study.learnzlab.com</a></li>
        <li style="margin-bottom: 8px;"><strong>Username/Email:</strong> ${to}</li>
        <li><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></li>
      </ul>
      
      <p>For security reasons, please change your password after your first login.</p>

      <h3 style="color: #6440FB; margin-top: 25px;">As a Trainer, you can:</h3>
      <ul style="padding-left: 20px; margin-bottom: 25px;">
        <li>Create and manage courses.</li>
        <li>Upload learning materials, assignments, and assessments.</li>
        <li>Conduct live sessions (where applicable).</li>
        <li>Track learner progress and engagement.</li>
        <li>Evaluate assignments and provide feedback.</li>
        <li>Interact with students through the LMS.</li>
      </ul>

      <p>We encourage you to maintain high-quality learning standards and create an engaging educational experience for our learners.</p>
      <p>For any technical or administrative assistance, please contact us at <a href="mailto:support@learnzlab.com" style="color: #6440FB; font-weight: 600;">support@learnzlab.com</a>.</p>
      <p>Thank you for being a part of LearnzLab Academy. We look forward to building impactful learning experiences together.</p>
      <br/>
      <p style="margin: 0;">Warm Regards,</p>
      <p style="margin: 5px 0 0 0;"><strong>Team LearnzLab Academy</strong></p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Email: <a href="mailto:support@learnzlab.com" style="color: #6440FB;">support@learnzlab.com</a></p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Website: <a href="http://www.learnzlab.com" style="color: #6440FB;">www.learnzlab.com</a></p>
    </div>
  `;

  const html = isStudent ? studentHtml : trainerHtml;

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
