import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import sgMail from '@sendgrid/mail';

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

      if (!process.env.SENDGRID_API_KEY) {
        throw new Error("SendGrid API key is not configured");
      }

      // Initialize SendGrid
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: process.env.SMTP_USER, // Your email address
        from: {
          email: process.env.SMTP_USER, // Must be verified with SendGrid
          name: "Portfolio Contact Form"
        },
        replyTo: {
          email: process.env.SMTP_USER,
          name: "Edlira Taipi"
        },
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
        console.log("Attempting to send email via SendGrid...");
        await sgMail.send(msg);
        console.log("Email sent successfully via SendGrid");

        res.json({
          message: "Message sent successfully"
        });
      } catch (sendError: any) {
        console.error("SendGrid error details:", {
          code: sendError.code,
          response: sendError.response?.body,
          message: sendError.message
        });

        throw new Error(`Failed to send email: ${sendError.message}`);
      }
    } catch (error: any) {
      console.error("Contact form error details:", {
        name: error.name,
        message: error.message,
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