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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-xl font-bold">Edlira Taipi</a>
          </Link>
          <div className="flex space-x-4">
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
