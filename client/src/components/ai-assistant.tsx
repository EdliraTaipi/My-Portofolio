import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

function Model() {
  // For now, we'll use a simple box as placeholder
  // Later we can replace with actual 3D model
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  );
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant'; text: string }>>([
    { type: 'assistant', text: "Hello! I'm your AI guide. Ask me anything about Edlira's work!" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }]);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: "I'm currently a demo assistant. Soon I'll be able to help you navigate through the portfolio and answer questions!"
      }]);
    }, 1000);

    setInput('');
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
                <h3 className="font-semibold">AI Portfolio Assistant</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 relative">
                <Canvas className="absolute inset-0">
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <Model />
                  <OrbitControls enableZoom={false} />
                </Canvas>
              </div>

              <div className="h-[200px] border-t bg-background/80 backdrop-blur-sm">
                <div className="h-[156px] p-4 overflow-y-auto">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-2 ${
                        msg.type === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <span
                        className={`inline-block px-3 py-2 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-2 flex gap-2 border-t">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                  />
                  <Button onClick={handleSend}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}
