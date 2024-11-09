import Feedback from "../models/Feedback.cjs"; 
import connectDB from '../config/db.cjs';
import nodemailer from "nodemailer";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        const { name, email, message } = req.body;

        try {
        const feedback = new Feedback({ name, email, message });
        await feedback.save();

        // Configure Nodemailer for sending confirmation email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"QueryAmie Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Thank you for your feedback!",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #f1f1f1; background-color: #1a202c; padding: 20px; border-radius: 8px;">
                <header style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #63b3ed; font-size: 24px;">QueryAmie</h1>
                </header>

                <main>
                <p style="font-size: 16px; color: #e2e8f0;">Hello <strong>${name}</strong>,</p>
                <p style="color: #cbd5e0;">
                    Thank you for reaching out to us! We have received your feedback and will get back to you if necessary.
                    At <strong>QueryAmie</strong>, we strive to improve continually, and your input is invaluable to us.
                </p>

                <div style="margin: 20px 0; padding: 15px; background-color: #2d3748; border-radius: 6px;">
                    <p style="font-size: 15px; color: #a0aec0;">
                    <em>Your feedback helps us to build a better experience for everyone.</em>
                    </p>
                </div>

                <p style="color: #cbd5e0;">Best regards,</p>
                <p style="font-size: 16px; color: #cbd5e0;"><strong>The QueryAmie Team</strong></p>
                </main>

                <footer style="margin-top: 30px; text-align: center; color: #718096; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} QueryAmie. All rights reserved.</p>
                <p>Unlock The Power of Your Document With AI.</p>
                </footer>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Feedback received and confirmation email sent." });
        } catch (error) {
        console.error("Error handling feedback:", error);
        res.status(500).json({ message: "Feedback submission failed." });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
