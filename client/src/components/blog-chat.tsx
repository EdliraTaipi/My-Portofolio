import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  type: 'chat' | 'system';
  username?: string;
  message: string;
  timestamp: number;
}

interface BlogChatProps {
  postId: string;
  isOpen: boolean;
}

export function BlogChat({ postId, isOpen }: BlogChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const maxReconnectAttempts = 5;
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      cleanupWebSocket();
      return;
    }

    connectWebSocket();

    return () => {
      cleanupWebSocket();
    };
  }, [isOpen, postId]);

  const cleanupWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setIsConnected(false);
    setHasJoined(false);
    setMessages([]);
    setConnectionError(null);
    setReconnectAttempts(0);
  };

  const connectWebSocket = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      setConnectionError("Maximum reconnection attempts reached. Please try again later.");
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        setMessages(prev => [...prev, newMessage]);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        if (isOpen && reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connectWebSocket();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError("Failed to connect to chat. Please try again later.");
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionError("Failed to establish chat connection. Please try again later.");
    }
  };

  const handleJoin = () => {
    if (!username.trim() || !wsRef.current || !isConnected) return;

    wsRef.current.send(JSON.stringify({
      type: 'join',
      postId,
      username: username.trim()
    }));

    setHasJoined(true);
  };

  const handleSend = () => {
    if (!message.trim() || !wsRef.current || !isConnected) return;

    wsRef.current.send(JSON.stringify({
      type: 'chat',
      message: message.trim()
    }));

    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-card border rounded-lg p-4 max-w-md w-full mx-auto"
    >
      {connectionError ? (
        <div className="text-center space-y-4">
          <p className="text-destructive">{connectionError}</p>
          <Button 
            onClick={() => {
              setConnectionError(null);
              setReconnectAttempts(0);
              connectWebSocket();
            }}
            disabled={reconnectAttempts >= maxReconnectAttempts}
          >
            Try Again
          </Button>
        </div>
      ) : !hasJoined ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Join the Discussion</h3>
          <Input
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          />
          <Button 
            onClick={handleJoin}
            disabled={!username.trim() || !isConnected}
            className="w-full"
          >
            Join Chat
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Live Chat</h3>
            <span className={`text-sm ${isConnected ? 'text-green-500' : 'text-destructive'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <ScrollArea className="h-[300px] rounded border p-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-2 ${msg.type === 'system' ? 'text-center text-sm text-muted-foreground' : ''}`}
                >
                  {msg.type === 'chat' ? (
                    <>
                      <span className="font-semibold">{msg.username}: </span>
                      <span>{msg.message}</span>
                    </>
                  ) : (
                    <span>{msg.message}</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={!isConnected}
            />
            <Button 
              onClick={handleSend}
              disabled={!message.trim() || !isConnected}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}