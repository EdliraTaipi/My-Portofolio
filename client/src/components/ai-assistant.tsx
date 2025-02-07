import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

function Model() {
  const meshRef = useRef();

  useEffect(() => {
    if (!meshRef.current) return;

    const animate = () => {
      meshRef.current.rotation.y += 0.01;
      requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animate);
  }, []);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  );
}

const chatResponses = {
  greeting: [
    "Hello! I'm your AI guide. How can I help you explore the portfolio?",
    "Hi there! Want to learn about Edlira's projects or experience?",
    "Welcome! I can help you navigate through the portfolio. What interests you?"
  ],
  projects: [
    "I'd be happy to show you some of Edlira's best projects! What type interests you - web development, AI, or full-stack?",
    "There are several interesting projects in the portfolio. Would you like to see the latest ones?"
  ],
  skills: [
    "Edlira specializes in React, TypeScript, and modern web development. Want to know more about a specific skill?",
    "The tech stack includes React, Node.js, and various modern tools. Which area would you like to explore?"
  ],
  experience: [
    "Edlira has experience in full-stack development and AI integration. Would you like specific details?",
    "Let me tell you about some key achievements and work experience. Any particular area you're curious about?"
  ],
  default: [
    "I can help you explore the portfolio, projects, or skills. What would you like to know?",
    "Feel free to ask about specific projects, technologies, or experience!"
  ]
};

function getResponse(input: string): string {
  const lowercaseInput = input.toLowerCase();

  if (lowercaseInput.includes('hi') || lowercaseInput.includes('hello')) {
    return chatResponses.greeting[Math.floor(Math.random() * chatResponses.greeting.length)];
  }
  if (lowercaseInput.includes('project')) {
    return chatResponses.projects[Math.floor(Math.random() * chatResponses.projects.length)];
  }
  if (lowercaseInput.includes('skill') || lowercaseInput.includes('tech')) {
    return chatResponses.skills[Math.floor(Math.random() * chatResponses.skills.length)];
  }
  if (lowercaseInput.includes('experience') || lowercaseInput.includes('work')) {
    return chatResponses.experience[Math.floor(Math.random() * chatResponses.experience.length)];
  }

  return chatResponses.default[Math.floor(Math.random() * chatResponses.default.length)];
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant'; text: string }>>([
    { type: 'assistant', text: "Hello! I'm your AI guide. Ask me anything about Edlira's work!" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }]);

    // Generate AI response
    setTimeout(() => {
      const response = getResponse(input);
      setMessages(prev => [...prev, { type: 'assistant', text: response }]);
    }, 500);

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
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">AI Portfolio Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-background/10 text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 relative">
                <Canvas className="absolute inset-0">
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <Model />
                  <OrbitControls 
                    enableZoom={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                  />
                </Canvas>
              </div>

              <div className="h-[200px] border-t bg-background/90 backdrop-blur-sm">
                <ScrollArea className="h-[156px] p-4">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-2 ${
                        msg.type === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <span
                        className={cn(
                          "inline-block px-3 py-2 rounded-lg max-w-[80%] break-words",
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80 transition-colors'
                        )}
                      >
                        {msg.text}
                      </span>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <div className="p-2 flex gap-2 border-t bg-card/50 backdrop-blur-sm">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="bg-background/50 focus:bg-background transition-colors"
                  />
                  <Button 
                    onClick={handleSend}
                    className="shrink-0"
                    size="icon"
                  >
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
          className={cn(
            "rounded-full w-14 h-14 shadow-lg",
            isOpen && "bg-primary hover:bg-primary/90"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}