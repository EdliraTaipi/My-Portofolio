import { Link } from "wouter";
import { motion } from "framer-motion";

export function NavigationBar() {
  const links = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm">
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <a className="text-xl font-bold hover:text-primary transition-colors">
              My Portfolio
            </a>
          </Link>
          <div className="flex space-x-2">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <a
                  href={link.href}
                  className="relative px-4 py-2 group"
                >
                  <span className="relative z-10 text-sm font-medium">
                    {link.label}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </nav>
  );
}