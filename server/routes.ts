import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import nodemailer from "nodemailer";
import { z } from "zod";
import { blogPosts, insertBlogPostSchema } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from 'express';

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(1, "Message is required")
});

interface ChatMessage {
  type: 'chat';
  username: string;
  message: string;
  timestamp: number;
}

interface ChatClient extends WebSocket {
  username?: string;
}

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Configure multer for image uploads
  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (_req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
      }
    }
  });

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Image upload endpoint
  app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  // Initialize WebSocket server with a specific path to avoid conflicts with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store active chat clients
  const chatClients = new Set<ChatClient>();

  wss.on('connection', (ws: ChatClient) => {
    console.log('New chat client connected');
    chatClients.add(ws);

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);

        switch (message.type) {
          case 'join':
            ws.username = message.username;
            const joinMessage = {
              type: 'system',
              message: `${message.username} joined the chat`,
              timestamp: Date.now()
            };
            broadcast(joinMessage);
            break;

          case 'chat':
            if (ws.username) {
              const chatMessage: ChatMessage = {
                type: 'chat',
                username: ws.username,
                message: message.message,
                timestamp: Date.now()
              };
              broadcast(chatMessage);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (ws.username) {
        const leaveMessage = {
          type: 'system',
          message: `${ws.username} left the chat`,
          timestamp: Date.now()
        };
        chatClients.delete(ws);
        broadcast(leaveMessage);
      }
    });
  });

  function broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    chatClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  // Blog posts endpoints
  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({
        error: "Failed to fetch blog posts",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const validatedPost = insertBlogPostSchema.parse(req.body);
      const [post] = await db.insert(blogPosts).values({
        ...validatedPost,
        authorId: 1, // TODO: Replace with actual user ID from session
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({
        error: "Failed to create blog post",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const validatedPost = insertBlogPostSchema.parse(req.body);

      const [updatedPost] = await db.update(blogPosts)
        .set({
          ...validatedPost,
          updatedAt: new Date()
        })
        .where(eq(blogPosts.id, postId))
        .returning();

      if (!updatedPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({
        error: "Failed to update blog post",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

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
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false,
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
      // First try to get articles from the user's profile
      const username = 'edlirataipi'; // Your DEV.to username
      let response = await fetch(`https://dev.to/api/articles?username=${username}`);

      if (!response.ok) {
        throw new Error('Failed to fetch DEV.to articles');
      }

      let articles = await response.json();

      // If no articles found for the user, get some featured articles as examples
      if (articles.length === 0) {
        response = await fetch('https://dev.to/api/articles?state=rising&per_page=6');
        if (!response.ok) {
          throw new Error('Failed to fetch featured articles');
        }
        articles = await response.json();
      }

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