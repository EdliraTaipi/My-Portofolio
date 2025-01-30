import { Link } from "wouter";
import { motion, useScroll, useSpring } from "framer-motion";
import { GithubButton } from "./github-button";

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

              {/* React version of GitHub button */}
              <div className="ml-4">
                <GithubButton />
              </div>

              {/* CSS-only version of GitHub button */}
              <a href="https://github.com/EdliraTaipi" target="_blank" rel="noopener noreferrer">
                <button className="Btn">
                  <svg className="svgIcon" viewBox="0 0 496 512" height="1.4em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"></path>
                  </svg>
                  <span className="text">GitHub</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .Btn {
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s ease-in-out;
          cursor: pointer;
          position: relative;
          background-color: rgb(31, 31, 31);
          overflow: hidden;
        }

        .svgIcon {
          transition: all 0.3s ease-in-out;
        }

        .svgIcon path {
          fill: white;
        }

        .text {
          position: absolute;
          color: white;
          width: 120px;
          font-weight: 600;
          opacity: 0;
          transition: all 0.4s ease-in-out;
        }

        .Btn:hover {
          width: 110px;
          border-radius: 30px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .Btn:hover .text {
          opacity: 1;
        }

        .Btn:hover .svgIcon {
          opacity: 0;
        }

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