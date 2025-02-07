import type { Express } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";
import { z } from "zod";
import { WebSocketServer, WebSocket } from 'ws';
import { blogPosts, insertBlogPostSchema } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

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
            ws.username = message.username;
            ws.postId = message.postId;

            if (!chatRooms.has(message.postId)) {
              chatRooms.set(message.postId, new Set());
            }
            chatRooms.get(message.postId)?.add(ws);

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
        chatRooms.get(ws.postId)?.delete(ws);

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