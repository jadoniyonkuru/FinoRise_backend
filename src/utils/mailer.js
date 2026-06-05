const nodemailer = require('nodemailer');

const sendInviteEmail = async ({ to, full_name, inviteLink }) => {
  if (!process.env.SMTP_HOST) {
    console.log(`\n📧 [DEV] Invite email for ${full_name} (${to})\n   Link: ${inviteLink}\n`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@finorise.com',
    to,
    subject: 'You have been invited to FinoRise',
    html: `
      <h2>Welcome to FinoRise, ${full_name}!</h2>
      <p>Your account has been created. Click the link below to set your password and activate your account.</p>
      <p><a href="${inviteLink}" style="padding:10px 20px;background:#4F46E5;color:white;border-radius:5px;text-decoration:none;">Accept Invitation</a></p>
      <p>This link expires in 48 hours.</p>
    `,
  });
};

module.exports = { sendInviteEmail };
