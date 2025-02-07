import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ChatScene } from './chat-3d/chat-scene';

interface Message {
  type: 'chat' | 'system';
  username?: string;
  message: string;
  timestamp: number;
}

export function Chat3DSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isSpoken, setIsSpoken] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      console.log('WebSocket connected');
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
      console.log('WebSocket disconnected');
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

        <div className="mx-auto mt-12 grid gap-8 md:grid-cols-2 items-start">
          <div className="h-[400px] bg-black rounded-lg overflow-hidden">
            <ChatScene isSpoken={isSpoken} />
          </div>

          <div className="bg-card rounded-lg p-6 shadow-lg border h-[400px] flex flex-col">
            {!username || !isConnected ? (
              <div className="flex-1 flex items-center justify-center">
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
              <>
                <ScrollArea className="flex-1 pr-4">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={
                        msg.type === 'system' 
                          ? 'text-center mb-2' 
                          : msg.username === username 
                            ? 'text-right mb-2' 
                            : 'text-left mb-2'
                      }
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
                            className={`inline-block px-3 py-2 rounded-lg max-w-[80%] break-words ${
                              msg.username === username
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {msg.message}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>

                <div className="mt-4 flex gap-2">
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
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
