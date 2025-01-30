import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(1, "Message is required")
});

export function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = contactFormSchema.parse(formData);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.details || "Failed to send message");

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });

      setFormData({ name: "", email: "", message: "" });
      setFormSubmitted(true);
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={formSubmitted ? "success" : "form"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {formSubmitted ? (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-primary/10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <motion.div
                        className="text-6xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        ✉️
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.img
                      src="https://images.pexels.com/photos/5605061/pexels-photo-5605061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Contact"
                      className="absolute inset-0 w-full h-full object-cover"
                      animate={{
                        scale: [1, 1.05, 1],
                        filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
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
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="input-field"
                      type="text"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="input-field"
                      type="email"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-field">
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Message"
                      className="input-field"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`sendMessage-btn w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <style>
        {`
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

          .input-field:disabled {
            opacity: 0.7;
            cursor: not-allowed;
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

          .sendMessage-btn:hover:not(:disabled) {
            transition: all ease-in-out 0.3s;
            background-color: #64ffda;
            color: #000;
            cursor: pointer;
            box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
          }

          .sendMessage-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}
      </style>
    </section>
  );
}