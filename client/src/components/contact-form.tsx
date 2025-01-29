import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
  };

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-8 text-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Get In Touch
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] rounded-lg overflow-hidden shadow-xl order-2 md:order-1"
            >
              <img
                src="https://images.pexels.com/photos/5605061/pexels-photo-5605061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Contact"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <motion.div 
                className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </motion.div>
            <Card className="max-w-md mx-auto w-full order-1 md:order-2">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Input placeholder="Name" required />
                  </motion.div>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Input type="email" placeholder="Email" required />
                  </motion.div>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Textarea placeholder="Message" required className="min-h-[120px]" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}