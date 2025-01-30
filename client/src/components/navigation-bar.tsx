import { Link } from "wouter";
import { motion, useScroll, useSpring } from "framer-motion";

export function NavigationBar() {
  const links = [
    { href: "#", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ];

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <motion.div
        className="h-1 bg-primary origin-[0%]"
        style={{ scaleX }}
      />
      <motion.div
        className="bg-background/80 backdrop-blur-sm border-b border-border/40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between py-4">
            <motion.h1 
              className="text-3xl font-bold text-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Edlira Taipi
            </motion.h1>

            <div className="flex items-center space-x-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScrollToSection(e, link.href)}
                  className="nav-btn hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .nav-btn {
          padding: 0.5em 1.5em;
          color: #ffffff;
          cursor: pointer;
          transition: 0.1s;
          text-decoration: none;
        }

        .nav-btn:hover {
          background: #666;
          border-radius: 4px;
        }
      `}</style>
    </nav>
  );
}