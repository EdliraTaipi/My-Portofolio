import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Chat3D } from './chat-3d/chat-3d';

interface Message {
  type: 'chat' | 'system';
  username?: string;
  message: string;
  timestamp: number;
}

export function Chat3DSection() {
  return (
    <section id="chat" className="py-24 bg-black/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Live Chat</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Join the conversation with our interactive 3D chat experience
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Chat3D />
        </div>
      </div>
    </section>
  );
}