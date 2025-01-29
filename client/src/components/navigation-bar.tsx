import { Link } from "wouter";
import { motion, useScroll, useSpring } from "framer-motion";

export function NavigationBar() {
  const links = [
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
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
          <div className="relative flex flex-col items-center justify-center">
            <motion.h1 
              className="text-3xl font-bold mt-4 mb-2 text-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              This is My Portfolio
            </motion.h1>
            <div className="nav">
              <div className="container-nav">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleScrollToSection(e, link.href)}
                    className="nav-btn"
                  >
                    {link.label}
                  </a>
                ))}
                <svg
                  className="outline"
                  overflow="visible"
                  width="400"
                  height="60"
                  viewBox="0 0 400 60"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    className="rect"
                    pathLength="100"
                    x="0"
                    y="0"
                    width="400"
                    height="60"
                    fill="transparent"
                    strokeWidth="5"
                  ></rect>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .outline {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .rect {
          stroke-dashoffset: 5;
          stroke-dasharray: 0 0 10 40 10 40;
          transition: 0.5s;
          stroke: #b0b0b0;
        }

        .nav {
          position: relative;
          width: 400px;
          height: 60px;
          margin: 0 auto 1rem;
        }

        .container-nav:hover .outline .rect {
          transition: 999999s;
          stroke-dashoffset: 1;
          stroke-dasharray: 0;
        }

        .container-nav {
          position: absolute;
          inset: 0;
          background: #333;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          padding: 0.5em;
          border-radius: 8px;
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

        .nav-btn:nth-child(1):hover ~ svg .rect {
          stroke-dashoffset: 0;
          stroke-dasharray: 0 2 8 73.3 8 10.7;
        }

        .nav-btn:nth-child(2):hover ~ svg .rect {
          stroke-dashoffset: 0;
          stroke-dasharray: 0 12.6 9.5 49.3 9.5 31.6;
        }

        .nav-btn:nth-child(3):hover ~ svg .rect {
          stroke-dashoffset: 0;
          stroke-dasharray: 0 24.5 8.5 27.5 8.5 55.5;
        }

        .nav-btn:nth-child(4):hover ~ svg .rect {
          stroke-dashoffset: 0;
          stroke-dasharray: 0 34.7 6.9 10.2 6.9 76;
        }

        .nav-btn:hover ~ .outline .rect {
          stroke-dashoffset: 0;
          stroke-dasharray: 0 0 10 40 10 40;
          transition: 0.5s !important;
        }
      `}</style>
    </nav>
  );
}