import type { Express } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(1, "Message is required")
});

export function registerRoutes(app: Express): Server {
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = contactFormSchema.parse(req.body);

      // Log environment variables status (without exposing values)
      console.log("Environment variables status:", {
        SMTP_USER: process.env.SMTP_USER ? "Set" : "Not set",
        SMTP_PASS: process.env.SMTP_PASS ? "Set" : "Not set"
      });

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error("SMTP credentials are not properly configured");
      }

      // Determine email provider and set appropriate SMTP settings
      const emailDomain = process.env.SMTP_USER.toLowerCase().split('@')[1];
      let smtpConfig;

      if (emailDomain === 'gmail.com') {
        smtpConfig = {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
        };
      } else if (emailDomain === 'hotmail.com' || emailDomain === 'outlook.com') {
        smtpConfig = {
          host: "smtp-mail.outlook.com",
          port: 587,
          secure: false,
          requireTLS: true,
        };
      } else {
        throw new Error(`Unsupported email provider: ${emailDomain}. Please use either Gmail or Hotmail/Outlook.`);
      }

      // Create reusable transporter object using SMTP transport
      const transporter = nodemailer.createTransport({
        ...smtpConfig,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        debug: true,
        logger: true
      });

      // Verify SMTP connection configuration
      try {
        console.log("Verifying SMTP connection...");
        await transporter.verify();
        console.log("SMTP connection verified successfully");
      } catch (verifyError: any) {
        console.error("SMTP Verification error details:", {
          code: verifyError.code,
          response: verifyError.response,
          responseCode: verifyError.responseCode,
          command: verifyError.command,
          message: verifyError.message,
          stack: verifyError.stack
        });

        // Provide specific error messages based on the email provider
        if (verifyError.responseCode === 535) {
          if (emailDomain === 'gmail.com') {
            throw new Error(
              "Gmail authentication failed. Please ensure you're using:\n" +
              "1. A Gmail account\n" +
              "2. An App Password (not your regular Gmail password)\n" +
              "You can generate an App Password in your Gmail Account Settings → Security → 2-Step Verification → App Passwords"
            );
          } else {
            throw new Error(
              "Hotmail/Outlook authentication failed. Please ensure you're using:\n" +
              "1. Your correct email address\n" +
              "2. Your account password or an app password if you have 2FA enabled"
            );
          }
        }
        throw new Error(`SMTP Verification failed: ${verifyError.message}`);
      }

      const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `Portfolio Contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `
      };

      try {
        console.log("Attempting to send email...");
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", {
          messageId: info.messageId,
          response: info.response
        });

        res.json({ 
          message: "Message sent successfully",
          messageId: info.messageId 
        });
      } catch (sendError: any) {
        console.error("Email sending error details:", {
          code: sendError.code,
          response: sendError.response,
          responseCode: sendError.responseCode,
          command: sendError.command,
          message: sendError.message,
          stack: sendError.stack
        });
        throw new Error(`Failed to send email: ${sendError.message}`);
      }
    } catch (error: any) {
      console.error("Contact form error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      });

      res.status(500).json({ 
        message: error instanceof z.ZodError 
          ? "Invalid form data" 
          : "Failed to send message",
        details: error.message,
        errorCode: error.code || 'UNKNOWN'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}