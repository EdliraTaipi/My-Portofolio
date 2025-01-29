import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="https://videos.pexels.com/video-files/853986/853986-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <motion.div
        className="relative z-10 text-center max-w-3xl px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Hi, I'm Edlira Taipi
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Web & Software Developer
        </p>
        <motion.blockquote
          className="text-lg md:text-xl italic text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          "You might not think that programmers are artists, but programming is an extremely creative profession. It's logic-based creativity."
          <footer className="text-sm mt-2 font-medium">
            — John Romero
          </footer>
        </motion.blockquote>
      </motion.div>
    </section>
  );
}