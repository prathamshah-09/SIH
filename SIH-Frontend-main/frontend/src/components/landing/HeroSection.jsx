import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";


const HeroSection = () => {
  const scrollToFeatures = () => {
    const element = document.querySelector("#features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden pb-20">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
  id="parallaxVideo"
  autoPlay
  muted
  loop
  playsInline
  className="w-full h-full object-cover scale-105"
>
  <source src="../public/videos/bg.mp4" type="video/mp4" />
</video>

        {/* Beautiful Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(215,40%,12%,0.4)] via-[hsl(205,60%,25%,0.5)] to-[hsl(200,50%,20%,0.7)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(210,70%,20%,0.3)] via-transparent to-[hsl(195,60%,25%,0.3)]" />
      </div>

      {/* Fallback gradient */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[hsl(205,85%,45%)] via-[hsl(200,70%,50%)] to-[hsl(185,60%,55%)]" />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[hsl(200,80%,70%,0.1)] blur-3xl float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[hsl(195,70%,60%,0.08)] blur-3xl float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-[hsl(210,60%,65%,0.12)] blur-2xl float" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight"
          >
            Sens<span className="text-[hsl(195,100%,75%)]">Ease</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl text-white/95 font-medium mb-6"
          >
            Because Every Mind Matters
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Empowering students and institutions with accessible, anonymous, and supportive mental well-being solutions.
          </motion.p>
        </motion.div>
      </div>

      {/* Explore Features Button at Bottom */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <button
            onClick={scrollToFeatures}
            className="group flex flex-col items-center gap-3 text-white/80 hover:text-white transition-all duration-300"
          >
            <span className="text-sm font-medium tracking-wide uppercase">Explore Features</span>
            <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/60 group-hover:bg-white/10 transition-all duration-300">
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
