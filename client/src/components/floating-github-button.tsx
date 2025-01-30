import { motion, useScroll, useTransform } from "framer-motion";

export function FloatingGithubButton() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.8, 1]);

  return (
    <motion.div
      className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50"
      style={{ opacity, scale }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <a 
        href="https://github.com/EdliraTaipi" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <button className="floating-github-btn">
          <svg className="github-icon" viewBox="0 0 496 512" height="1.4em" xmlns="http://www.w3.org/2000/svg">
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"></path>
          </svg>
          <span className="github-text">GitHub</span>
          <div className="github-pulse"></div>
        </button>
      </a>

      <style jsx>{`
        .floating-github-btn {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgb(31, 31, 31);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s ease-in-out;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .github-icon {
          transition: all 0.3s ease-in-out;
        }

        .github-icon path {
          fill: #64ffda;
        }

        .github-text {
          position: absolute;
          color: #64ffda;
          font-weight: 600;
          opacity: 0;
          transform: translateX(20px);
          transition: all 0.3s ease-in-out;
        }

        .github-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #64ffda;
          border-radius: 50%;
          opacity: 0;
          transform: scale(1);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          70% {
            transform: scale(2);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        .floating-github-btn:hover {
          width: 140px;
          border-radius: 25px;
          background: #1a1a1a;
        }

        .floating-github-btn:hover .github-icon {
          transform: translateX(-30px);
        }

        .floating-github-btn:hover .github-text {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </motion.div>
  );
}