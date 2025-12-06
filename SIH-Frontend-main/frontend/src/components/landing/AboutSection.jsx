import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial-blue opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            Who We Are
          </span>
          <h2 className="section-title">
            Our Mission
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex"
          >
            <div className="glass-card-hover p-8 lg:p-10 h-full w-full flex flex-col">
              <h3 className="text-xl font-bold text-foreground mb-6">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                At SensEase, our mission is to help colleges build emotionally resilient campuses 
                by providing accessible, anonymous, and supportive mental well-being solutions 
                for every student. We believe that mental health support should be available to 
                everyone, free from stigma and barriers.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex"
          >
            <div className="glass-card-hover p-8 lg:p-10 h-full w-full flex flex-col">
              <h3 className="text-xl font-bold text-foreground mb-6">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                We envision a world where every educational institution is equipped with 
                the tools and resources to support student mental wellness. A future where 
                seeking help is normalized, and every mind has the opportunity to thrive.
              </p>
            </div>
          </motion.div>

          {/* Why SensEase Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex"
          >
            <div className="glass-card-hover p-8 lg:p-10 h-full w-full flex flex-col">
              <h3 className="text-xl font-bold text-foreground mb-6">Why SensEase?</h3>
              <p className="text-muted-foreground leading-relaxed">
                We combine cutting-edge AI technology with evidence-based mental health 
                practices to create a safe space for students. Our platform bridges the 
                gap between students who need support and the professional help they deserve.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
