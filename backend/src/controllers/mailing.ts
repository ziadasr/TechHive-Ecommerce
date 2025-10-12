import nodemailer from "nodemailer";

async function sendEmail(
  to: string,
  subject: string,
  text: string
): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    });

    const info = await transporter.sendMail({
      from: '"TECHHIV"', // Add display name before email
      to,
      subject,
      html: text,
    });

    console.log("✅ Email sent:");
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
}

export default sendEmail;
