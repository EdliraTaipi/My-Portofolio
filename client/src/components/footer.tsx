import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer 
      className="py-6 bg-background border-t"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <motion.p 
          className="text-center text-sm text-muted-foreground"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          &copy; {new Date().getFullYear()} Edlira Taipi. All Rights Reserved.
        </motion.p>
      </div>
    </motion.footer>
  );
}
