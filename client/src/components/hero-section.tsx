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
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Hi, I'm Edlira Taipi
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          Web & Software Developer
        </p>
      </motion.div>
    </section>
  );
}
