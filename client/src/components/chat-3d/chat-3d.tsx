import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [messages, setMessages] = useState<Message[]>([
    { type: 'system', message: "Welcome! Join the conversation.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isSpoken, setIsSpoken] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Auto-scroll effect for messages only
  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.closest('.scroll-area-viewport');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const connectWebSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsJoining(false);
        reconnectAttempts.current = 0;

        try {
          socket.send(JSON.stringify({
            type: 'join',
            username: username
          }));
        } catch (error) {
          console.error('Failed to send join message:', error);
        }
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => [...prev, message]);
          setIsSpoken(true);
          setTimeout(() => setIsSpoken(false), 1000);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);

        if (username && !reconnectTimeoutRef.current && reconnectAttempts.current < 5) {
          const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = undefined;
            reconnectAttempts.current++;
            connectWebSocket();
          }, backoffTime);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      socketRef.current = socket;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setIsConnected(false);
      setIsJoining(false);
      toast({
        title: "Connection Error",
        description: "Failed to establish chat connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJoin = (e?: React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
    }

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

  const handleSend = async (e?: React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!input.trim() || !socketRef.current || !isConnected || isSending) return;

    try {
      setIsSending(true);
      await new Promise((resolve, reject) => {
        if (!socketRef.current) {
          reject(new Error('No socket connection'));
          return;
        }

        socketRef.current.send(JSON.stringify({
          type: 'chat',
          message: input.trim()
        }));
        resolve(true);
      });

      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800">
      <div className="h-[300px] bg-transparent">
        <ChatScene isSpoken={isSpoken} />
      </div>

      <div className="p-6 bg-gradient-to-b from-transparent to-gray-900/50 backdrop-blur-sm">
        {!username || !isConnected ? (
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm space-y-4 bg-gray-800/50 p-6 rounded-lg backdrop-blur-md">
              <h4 className="text-lg font-semibold text-center mb-4 text-gray-100">
                Join the Chat
              </h4>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isJoining && handleJoin(e)}
                disabled={isJoining}
                className="bg-gray-700/50 border-gray-600"
              />
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                onClick={() => handleJoin()}
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
                <div
                  key={i}
                  className={cn(
                    'mb-2',
                    msg.type === 'system' ? 'text-center' : msg.username === username ? 'text-right' : 'text-left'
                  )}
                >
                  {msg.type === 'system' ? (
                    <span className="inline-block px-3 py-1 text-sm text-gray-300 bg-gray-800/50 rounded-full">
                      {msg.message}
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-xs text-gray-400">
                        {msg.username === username ? 'You' : msg.username} • {formatTime(msg.timestamp)}
                      </span>
                      <span
                        className={cn(
                          "inline-block px-4 py-2 rounded-lg max-w-[80%] break-words shadow-lg",
                          msg.username === username
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-gray-800/70 text-gray-100'
                        )}
                      >
                        {msg.message}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSend(e)}
                placeholder="Type a message..."
                disabled={!isConnected || isSending}
                className="bg-gray-800/50 border-gray-700"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!isConnected || isSending}
                size="icon"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}