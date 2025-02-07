import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Points, PointMaterial, Sphere } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as THREE from 'three';

function ParticleField() {
  const points = useRef();
  const particleCount = 5000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  useEffect(() => {
    if (!points.current) return;

    const animate = () => {
      points.current.rotation.y += 0.0005;
      points.current.rotation.z += 0.0002;
      requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animate);
  }, []);

  for (let i = 0; i < particleCount; i++) {
    const radius = 5 + Math.random() * 5;
    const theta = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);

    positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = radius * Math.cos(theta);

    const color = new THREE.Color();
    color.setHSL(Math.random(), 0.7, 0.7);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        vertexColors
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
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
}

function EnergyCore() {
  const sphereRef = useRef();

  useEffect(() => {
    if (!sphereRef.current) return;

    const animate = () => {
      const time = Date.now() * 0.001;
      sphereRef.current.scale.x = 1 + Math.sin(time) * 0.2;
      sphereRef.current.scale.y = 1 + Math.cos(time * 1.3) * 0.2;
      sphereRef.current.scale.z = 1 + Math.sin(time * 0.7) * 0.2;
      sphereRef.current.rotation.y += 0.002;
      requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animate);
  }, []);

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]}>
      <meshPhongMaterial
        color="#4fc3f7"
        emissive="#0288d1"
        specular="#ffffff"
        shininess={100}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { type: 'assistant', text: "Hello! I'm your AI guide. Ask me anything about Edlira's work!" }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setMessages(prev => [...prev, { type: 'user', text: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const { response: aiResponse } = await response.json();
      setMessages(prev => [...prev, { type: 'assistant', text: aiResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: "I apologize, but I'm having trouble connecting to my AI services at the moment. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
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
                  <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <spotLight position={[-10, -10, -10]} intensity={0.5} />
                  <EnergyCore />
                  <ParticleField />
                  <OrbitControls 
                    enableZoom={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
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
                    disabled={isLoading}
                    className="bg-background/50 focus:bg-background transition-colors"
                  />
                  <Button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className="shrink-0"
                    size="icon"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
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