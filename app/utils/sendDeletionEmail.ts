import nodemailer from "nodemailer";

export async function sendDeletionEmail(email: string, uid: string) {
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: { user: process.env.SENDGRID_USER, pass: process.env.SENDGRID_PASS },
  });

  await transporter.sendMail({
    from: "info@smartbill.lk",
    to: email,
    subject: "Your account has been deleted",
    text: `Your account (${uid} - ${email}) and data have been permanently deleted. Thank you for using our service.`,
  });
}
