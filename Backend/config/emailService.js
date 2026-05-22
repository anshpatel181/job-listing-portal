import nodemailer from "nodemailer";
import { Resend } from "resend"

const resend = new Resend("re_VSwdW8RA_9CWZzpDUoZhE7yCqfsFtJwN9");

// let transporter = null;

// const getTransporter = async () => {
//   if (transporter) return transporter;

//   const hasEnvCredentials = process.env.SMTP_USER && process.env.SMTP_PASS;

//   if (hasEnvCredentials) {
//     transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST || "smtp.ethereal.email",
//       port: parseInt(process.env.SMTP_PORT || "587"),
//       secure: process.env.SMTP_PORT === "465",
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });
//   } else {
//     try {
//       console.log("⌛ Generating temporary Ethereal email credentials...");
//       const testAccount = await nodemailer.createTestAccount();
//       transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false,
//         auth: {
//           user: testAccount.user,
//           pass: testAccount.pass,
//         },
//       });
//       console.log("✉️ Ephemeral Ethereal SMTP account created successfully.");
//       console.log(`   User: ${testAccount.user} | Pass: ${testAccount.pass}`);
//     } catch (err) {
//       console.error("⚠️ Failed to generate Ethereal credentials:", err.message);
//       transporter = nodemailer.createTransport({ jsonTransport: true });
//     }
//   }

//   return transporter;
// };


export const sendResetEmail = async (toEmail, otp, resetLink) => {

  const fromAddress = process.env.EMAIL_FROM

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
      <h2 style="color: #2563eb; text-align: center;">Amdox Job Portal</h2>
      <p>Hello,</p>
      <p>You requested a password reset. You can verify your identity using either the 6-digit OTP code below, or by clicking the link button.</p>
      
      <!-- OTP code -->
      <div style="background-color: #f4f4f5; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #18181b;">${otp}</span>
        <p style="font-size: 12px; color: #71717a; margin-top: 5px;">Valid for 10 minutes</p>
      </div>

      <!-- Link button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password Directly</a>
      </div>

      <p style="font-size: 12px; color: #71717a; text-align: center;">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;


  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: toEmail,
    subject: "Reset your Amdox Job Portal Password",
    html: emailHtml,
    click_tracking: false,
    tags: []
  });

  if (error) {
    console.log(error);
  }

  // const previewUrl = nodemailer.getTestMessageUrl(info);
  // if (previewUrl) {
  //   console.log(`✉️ [Email Sent] Preview sent email here: \x1b[36m${previewUrl}\x1b[0m`);
  //   return { success: true, previewUrl };
  // }

  return { success: true };
};


/* flow of the email service using manual method in which we have to create transporter that communicates with smtp server and also we need to create test account for auth credentials  

step 1: our backend creates email
step 2: Nodemailer is a transporter that communicates with smtp server we have created using smtp protocol
step 3: now smtp server check auth credentials of mail sender which means is the user is authorized or not to send emails
step 4: if credentials are valid then smtp server will communicates with recipient's mail server and recipient's mail server can be google's gmail server or yahoo's mail server or etc.
step 5: Then smtp server send email to recipient's inbox via it's mail server

conclusion: The main thing in this manual method is we are using ethereal which has smtp infrastructure and ethereal.email domain then email coming from ethereal testing account has permissions to receive that email, stored for testing, and can be previewed instead of real delivery to the recipient's inbox via mail server.
*/

/*

flow of resend:

My Backend -> HTTPS API Request -> Resend Infrastructure -> Resend SMTP/Mail Servers -> Recipient Mail Server -> Recipient Inbox

so main thing is in resend recipient mail server allows to recieve emails because emails are coming from resend which has a trusted domain + sending infrastructure
*/