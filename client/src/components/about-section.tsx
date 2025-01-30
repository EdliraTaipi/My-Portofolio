import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Github } from "lucide-react";

export function AboutSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="about" className="py-20 bg-background" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="relative h-[300px] rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src="https://p1.pxfuel.com/preview/97/32/886/programmer-code-programming-coding-technology-html.jpg"
                alt="Programming"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ y }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"
                whileHover={{ opacity: 0.7 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <Card className="md:col-span-1">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] space-y-4">
                <motion.p 
                  className="text-muted-foreground text-center"
                  style={{ opacity }}
                >
                  I'm a passionate developer with expertise in data analysis, web development, and programming. I strive to create elegant solutions that combine functionality with aesthetic appeal.
                </motion.p>

                <motion.a
                  href="https://github.com/EdliraTaipi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-btn group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-6 h-6 text-[#64ffda] group-hover:text-background transition-colors" />
                  <span className="ml-2">Check out my GitHub account projects</span>
                </motion.a>
              </CardContent>
            </Card>

            <motion.div
              className="relative h-[300px] rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src="https://p1.pxfuel.com/preview/14/432/956/laptop-computer-dark-room.jpg"
                alt="Development"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"
                whileHover={{ opacity: 0.7 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>
        {`
          .github-btn {
            display: inline-flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            background: transparent;
            border: 2px solid #64ffda;
            color: #64ffda;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            margin-top: 1rem;
          }

          .github-btn:hover {
            background: #64ffda;
            color: #171717;
          }
        `}
      </style>
    </section>
  );
}