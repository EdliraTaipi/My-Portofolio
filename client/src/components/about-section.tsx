import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  I'm a passionate developer with expertise in data analysis, web development, and programming. I strive to create elegant solutions that combine functionality with aesthetic appeal.
                </p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://p1.pxfuel.com/preview/97/32/886/programmer-code-programming-coding-technology-html.jpg"
                alt="Programming"
                className="rounded-lg object-cover w-full h-full"
              />
              <img
                src="https://p1.pxfuel.com/preview/14/432/956/laptop-computer-dark-room.jpg"
                alt="Development"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}