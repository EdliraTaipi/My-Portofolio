import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChatScene } from './chat-scene';

interface Message {
  type: 'chat' | 'system';
  username?: string;
  message: string;
  timestamp: number;
}

export function Chat3D() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { type: 'system', message: "Welcome to the 3D chat! Join the conversation.", timestamp: Date.now() }
    ];
  });
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isSpoken, setIsSpoken] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const connectWebSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({
        type: 'join',
        username: username
      }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
      setIsSpoken(true);
      setTimeout(() => setIsSpoken(false), 1000);
    };

    socket.onclose = () => {
      setIsConnected(false);
      setTimeout(() => {
        if (username) {
          connectWebSocket();
        }
      }, 3000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat. Please try again.",
        variant: "destructive",
      });
    };

    socketRef.current = socket;
  };

  const handleJoin = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to join the chat",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    connectWebSocket();
  };

  const handleSend = () => {
    if (!input.trim() || !socketRef.current || !isConnected) return;

    socketRef.current.send(JSON.stringify({
      type: 'chat',
      message: input.trim()
    }));

    setInput('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-full bg-card rounded-lg shadow-lg overflow-hidden border">
      <div className="h-[300px] bg-black">
        <ChatScene isSpoken={isSpoken} />
      </div>

      <div className="p-6">
        {!username || !isConnected ? (
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm space-y-4">
              <h4 className="text-lg font-semibold text-center mb-4">
                Join the Chat
              </h4>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                disabled={isJoining}
              />
              <Button
                className="w-full"
                onClick={handleJoin}
                disabled={isJoining}
              >
                {isJoining ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Join Chat
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ScrollArea className="h-[200px] pr-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'mb-2',
                    msg.type === 'system' ? 'text-center' : msg.username === username ? 'text-right' : 'text-left'
                  )}
                >
                  {msg.type === 'system' ? (
                    <span className="inline-block px-3 py-1 text-sm text-muted-foreground bg-muted rounded-full">
                      {msg.message}
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">
                        {msg.username === username ? 'You' : msg.username} • {formatTime(msg.timestamp)}
                      </span>
                      <span
                        className={cn(
                          "inline-block px-3 py-2 rounded-lg max-w-[80%] break-words",
                          msg.username === username
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        {msg.message}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                disabled={!isConnected}
              />
              <Button
                onClick={handleSend}
                disabled={!isConnected}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}