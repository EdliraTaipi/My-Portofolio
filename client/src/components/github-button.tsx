import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

export function GithubButton() {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <a
        href="https://github.com/EdliraTaipi"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline" size="lg" className="gap-2">
          <Github className="h-5 w-5" />
          <span>GitHub Profile</span>
        </Button>
      </a>
    </motion.div>
  );
}
