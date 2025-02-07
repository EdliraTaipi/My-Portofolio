import type { Express } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";
import { z } from "zod";
import { WebSocketServer, WebSocket } from 'ws';
import fetch from 'node-fetch';

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(1, "Message is required")
});

interface ChatMessage {
  type: 'chat';
  postId: string;
  username: string;
  message: string;
  timestamp: number;
}

interface ChatClient extends WebSocket {
  username?: string;
  postId?: string;
}

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Initialize WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store active chat rooms (postId -> Set of clients)
  const chatRooms = new Map<string, Set<ChatClient>>();

  wss.on('connection', (ws: ChatClient) => {
    console.log('New WebSocket connection established');

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);

        switch (message.type) {
          case 'join':
            // Join chat room for specific post
            ws.username = message.username;
            ws.postId = message.postId;

            if (!chatRooms.has(message.postId)) {
              chatRooms.set(message.postId, new Set());
            }
            chatRooms.get(message.postId)?.add(ws);

            // Notify others in the room
            const joinMessage = {
              type: 'system',
              message: `${message.username} joined the chat`,
              timestamp: Date.now()
            };
            broadcastToRoom(message.postId, joinMessage);
            break;

          case 'chat':
            if (ws.postId && ws.username) {
              const chatMessage: ChatMessage = {
                type: 'chat',
                postId: ws.postId,
                username: ws.username,
                message: message.message,
                timestamp: Date.now()
              };
              broadcastToRoom(ws.postId, chatMessage);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (ws.postId && ws.username) {
        // Remove from chat room
        chatRooms.get(ws.postId)?.delete(ws);

        // Notify others
        const leaveMessage = {
          type: 'system',
          message: `${ws.username} left the chat`,
          timestamp: Date.now()
        };
        broadcastToRoom(ws.postId, leaveMessage);
      }
    });
  });

  function broadcastToRoom(postId: string, message: any) {
    const room = chatRooms.get(postId);
    if (room) {
      const messageStr = JSON.stringify(message);
      room.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = contactFormSchema.parse(req.body);

      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_PORT) {
        throw new Error("SMTP configuration is incomplete");
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === "465", // Use secure for port 465, otherwise false
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false, // Accept self-signed certificates
          ciphers: 'SSLv3'
        }
      });

      const mailOptions = {
        from: {
          name: "Portfolio Contact Form",
          address: process.env.SMTP_USER
        },
        replyTo: {
          name: name,
          address: email
        },
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
        console.log("Email sent successfully:", info.messageId);

        res.json({
          success: true,
          message: "Message sent successfully"
        });
      } catch (sendError: any) {
        console.error("Email sending error:", {
          code: sendError.code,
          response: sendError.response,
          message: sendError.message
        });
        throw new Error(`Failed to send email: ${sendError.message}`);
      }
    } catch (error: any) {
      console.error("Contact form error:", {
        name: error.name,
        message: error.message,
        code: error.code
      });

      res.status(500).json({
        success: false,
        message: error instanceof z.ZodError ? "Invalid form data" : "Failed to send message",
        details: error.message
      });
    }
  });

  // Add GitHub blog feed endpoint
  app.get("/api/github-blog", async (req, res) => {
    try {
      const response = await fetch('https://github.blog/news-insights/feed/');
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub blog feed');
      }
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Error fetching GitHub blog feed:', error);
      res.status(500).json({
        error: 'Failed to fetch blog posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Add DEV.to articles endpoint
  app.get("/api/dev-articles", async (req, res) => {
    try {
      const response = await fetch('https://dev.to/api/articles?username=edlirataipi');
      if (!response.ok) {
        throw new Error('Failed to fetch DEV.to articles');
      }
      const articles = await response.json();
      res.json(articles);
    } catch (error) {
      console.error('Error fetching DEV.to articles:', error);
      res.status(500).json({
        error: 'Failed to fetch articles',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return httpServer;
}