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
          <h2 className="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] rounded-lg overflow-hidden shadow-xl order-2 md:order-1"
            >
              <motion.img
                src="https://images.pexels.com/photos/5605061/pexels-photo-5605061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Contact"
                className="absolute inset-0 w-full h-full object-cover"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="absolute inset-0 bg-[#64ffda]/10 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </motion.div>
            <motion.div 
              className="form-card1 order-1 md:order-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="form-card2">
                <form onSubmit={handleSubmit} className="form">
                  <p className="form-heading text-center text-xl mb-6">Get In Touch</p>
                  <div className="form-field">
                    <input required placeholder="Name" className="input-field" type="text" />
                  </div>
                  <div className="form-field">
                    <input required placeholder="Email" className="input-field" type="email" />
                  </div>
                  <div className="form-field">
                    <textarea required placeholder="Message" className="input-field" rows={3} />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button type="submit" className="sendMessage-btn w-full">
                      Send Message
                    </button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .form-card1 {
          background-image: linear-gradient(163deg, #64ffda 0%, #64ffda 100%);
          border-radius: 22px;
          transition: all 0.3s;
        }

        .form-card1:hover {
          box-shadow: 0px 0px 30px 1px rgba(100, 255, 218, 0.3);
        }

        .form-card2 {
          border-radius: 0;
          transition: all 0.2s;
        }

        .form-card2:hover {
          transform: scale(0.98);
          border-radius: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 2em;
          background-color: #171717;
          border-radius: 20px;
        }

        .form-field {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          border-radius: 10px;
          padding: 0.6em;
          border: none;
          outline: none;
          color: white;
          background-color: #171717;
          box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
        }

        .input-field {
          background: none;
          border: none;
          outline: none;
          width: 100%;
          color: #ccd6f6;
          padding-inline: 1em;
        }

        .sendMessage-btn {
          cursor: pointer;
          margin-bottom: 1em;
          padding: 1em;
          border-radius: 10px;
          border: none;
          outline: none;
          background-color: transparent;
          color: #64ffda;
          font-weight: bold;
          outline: 1px solid #64ffda;
          transition: all ease-in-out 0.3s;
        }

        .sendMessage-btn:hover {
          transition: all ease-in-out 0.3s;
          background-color: #64ffda;
          color: #000;
          cursor: pointer;
          box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
        }
      `}</style>
    </section>
  );
}