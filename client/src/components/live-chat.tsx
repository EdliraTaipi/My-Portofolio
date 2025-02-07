import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  type: 'chat' | 'system';
  username?: string;
  message: string;
  timestamp: number;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

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
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (username && isOpen) {
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
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[400px] h-[500px] bg-card rounded-lg shadow-lg overflow-hidden border"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 bg-muted flex justify-between items-center border-b">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Live Chat</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-background/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {!username || !isConnected ? (
                <div className="flex-1 flex items-center justify-center p-6">
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
                  <div className="flex-1 bg-background/50 backdrop-blur">
                    <ScrollArea className="h-full px-4 py-4">
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            'mb-4',
                            msg.type === 'system' ? 'text-center' : msg.username === username ? 'text-right' : 'text-left'
                          )}
                        >
                          {msg.type === 'system' ? (
                            <span className="inline-block px-3 py-1 text-sm text-muted-foreground bg-muted rounded-full">
                              {msg.message}
                            </span>
                          ) : (
                            <div className={cn(
                              'space-y-1',
                              msg.username === username ? 'items-end' : 'items-start'
                            )}>
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
                  </div>

                  <div className="p-4 bg-card border-t">
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="rounded-full w-14 h-14 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
