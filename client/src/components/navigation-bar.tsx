import { Link } from "wouter";
import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

export function NavigationBar() {
  const links = [
    { href: "#", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#blog", label: "Blog" },
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

  const nameLetters = "Edlira Taipi".split("");

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <motion.div
        className="h-1 bg-primary origin-[0%]"
        style={{ scaleX }}
      />
      <motion.div
        className="bg-background/95 backdrop-blur-md border-b border-border/40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-4">
            <motion.div className="mb-4 flex">
              {nameLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  className={`text-2xl font-bold ${letter === " " ? "mx-2" : ""} ${
                    letter === "E" ? "text-primary" : ""
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5
                  }}
                  whileHover={{
                    scale: 1.2,
                    color: "hsl(170, 100%, 70%)",
                    transition: { duration: 0.2 }
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
            <div className="nav-links">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScrollToSection(e, link.href)}
                  className="nav-link"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <style>
        {`
        .nav-links {
          display: flex;
          gap: 2rem;
          justify-content: center;
          align-items: center;
        }

        .nav-link {
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem;
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: hsl(var(--primary));
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease;
        }

        .nav-link:hover {
          color: hsl(var(--primary));
        }

        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
        `}
      </style>
    </nav>
  );
}