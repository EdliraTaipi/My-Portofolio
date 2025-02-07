import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sphere, Points, PointMaterial } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import * as THREE from 'three';

function ParticleRing() {
  const points = useRef();

  useEffect(() => {
    if (!points.current) return;

    const animate = () => {
      points.current.rotation.z += 0.001;
      requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animate);
  }, []);

  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const radius = 2;

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const randomRadius = radius + (Math.random() - 0.5) * 0.5;
    positions[i * 3] = Math.cos(angle) * randomRadius;
    positions[i * 3 + 1] = Math.sin(angle) * randomRadius;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        color="#88ccff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
}

function PulsingSphere() {
  const sphereRef = useRef();

  useEffect(() => {
    if (!sphereRef.current) return;

    const animate = () => {
      const time = Date.now() * 0.001;
      sphereRef.current.scale.x = 1 + Math.sin(time) * 0.1;
      sphereRef.current.scale.y = 1 + Math.sin(time) * 0.1;
      sphereRef.current.scale.z = 1 + Math.sin(time) * 0.1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animate);
  }, []);

  return (
    <Sphere ref={sphereRef} args={[1, 32, 32]}>
      <meshPhongMaterial
        color="#00a3ff"
        emissive="#003366"
        specular="#ffffff"
        shininess={100}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

const chatResponses = {
  greeting: [
    "Hello! I'm your AI guide. I can help you explore Edlira's portfolio, discuss projects, or answer questions about skills and experience. What would you like to know?",
    "Welcome! I'm here to help you navigate through the portfolio. I can tell you about Edlira's projects, skills, or experience. What interests you most?"
  ],
  projects: [
    "Let me tell you about Edlira's key projects:\n\n1. Modern Portfolio Website: A React-based portfolio with interactive 3D elements and an AI assistant.\n2. Tech Blog Platform: A full-stack application for sharing technical insights.\n3. Real-time Chat System: Implemented using WebSocket for live discussions.\n\nWhich project would you like to know more about?",
    "Edlira has worked on several exciting projects:\n\n• Frontend Development: React.js applications with modern UI/UX\n• Backend Systems: Node.js and Express APIs\n• Full-stack Solutions: Complete web applications with database integration\n\nWould you like specific details about any of these areas?"
  ],
  skills: [
    "Here's an overview of Edlira's technical skills:\n\n🔹 Frontend: React.js, TypeScript, Tailwind CSS\n🔹 Backend: Node.js, Express, PostgreSQL\n🔹 Tools: Git, Docker, CI/CD\n🔹 Specialties: Responsive Design, API Integration, 3D Web Graphics\n\nWould you like to know more about any specific skill?",
    "Edlira's expertise includes:\n\n• Modern Web Development\n• Database Design & Management\n• UI/UX Implementation\n• Performance Optimization\n• System Architecture\n\nFeel free to ask about any particular area!"
  ],
  experience: [
    "Let me share Edlira's professional experience:\n\n📌 Full-stack Development: Building complete web applications\n📌 Frontend Specialist: Creating responsive, accessible interfaces\n📌 Technical Leadership: Managing projects and mentoring teams\n\nWould you like more details about any specific role or project?",
    "Edlira's journey includes:\n\n1. Web Development: Creating modern, scalable applications\n2. System Architecture: Designing robust backend solutions\n3. Technical Innovation: Implementing cutting-edge features\n\nWhat aspect would you like to explore further?"
  ],
  default: [
    "I can help you learn about:\n\n• Projects & Portfolio\n• Technical Skills\n• Professional Experience\n• Blog Articles\n\nWhat would you like to explore?",
    "I'm knowledgeable about all aspects of Edlira's work, including:\n\n- Development Projects\n- Technical Expertise\n- Professional Background\n- Writing & Publications\n\nFeel free to ask about any topic!"
  ]
};

function getResponse(input: string): string {
  const lowercaseInput = input.toLowerCase();
  let responses = [];

  // Check for multiple topics in the input
  if (lowercaseInput.includes('hi') || lowercaseInput.includes('hello')) {
    responses.push(...chatResponses.greeting);
  }
  if (lowercaseInput.includes('project')) {
    responses.push(...chatResponses.projects);
  }
  if (lowercaseInput.includes('skill') || lowercaseInput.includes('tech')) {
    responses.push(...chatResponses.skills);
  }
  if (lowercaseInput.includes('experience') || lowercaseInput.includes('work')) {
    responses.push(...chatResponses.experience);
  }

  // If no specific topics found or multiple topics mentioned
  if (responses.length === 0) {
    responses = chatResponses.default;
  }

  // Return a random response from the collected responses
  return responses[Math.floor(Math.random() * responses.length)];
}

export function AiAssistant() {
  // Use localStorage to persist chat state
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { type: 'assistant', text: "Hello! I'm your AI guide. Ask me anything about Edlira's work!" }
    ];
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

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
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <spotLight position={[-10, -10, -10]} intensity={0.5} />
                  <PulsingSphere />
                  <ParticleRing />
                  <OrbitControls 
                    enableZoom={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={1}
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
                          "inline-block px-3 py-2 rounded-lg max-w-[80%] break-words whitespace-pre-wrap",
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