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

      // Create reusable transporter object using SMTP transport
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        logger: true, // Enable logging
        debug: true, // Include debug info
        tls: {
          rejectUnauthorized: false // Accept self-signed certificates
        }
      });

      // Verify SMTP connection configuration
      try {
        await transporter.verify();
        console.log("SMTP connection verified successfully");
      } catch (verifyError: any) {
        console.error("SMTP Verification failed:", verifyError);
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

      // Log mail options (without sensitive data)
      console.log("Sending email with options:", {
        ...mailOptions,
        from: "HIDDEN",
        to: "HIDDEN"
      });

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);

      res.json({ 
        message: "Message sent successfully",
        messageId: info.messageId 
      });
    } catch (error: any) {
      console.error("Contact form detailed error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      });

      const errorMessage = error instanceof Error ? error.message : "Failed to send message";

      res.status(500).json({ 
        message: error instanceof z.ZodError 
          ? "Invalid form data" 
          : "Failed to send message",
        details: errorMessage,
        errorCode: error.code || 'UNKNOWN'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}