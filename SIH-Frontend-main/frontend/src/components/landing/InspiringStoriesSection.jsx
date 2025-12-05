import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const stories = [
  {
    name: "Demi Lovato",
    story: "Depression & Recovery",
    quote: "Recovery is something that you have to work on every single day.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Robert Downey Jr.",
    story: "Overcoming Addiction",
    quote: "The lesson is that you can still make mistakes and be forgiven.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Virat Kohli",
    story: "Battling Mental Pressure",
    quote: "Self-belief and hard work will always earn you success.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Lady Gaga",
    story: "Living with PTSD",
    quote: "I've been searching for ways to heal myself, and I've found that kindness is the best way.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Deepika Padukone",
    story: "Fighting Depression",
    quote: "It is okay to not be okay. It is okay to ask for help.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Michael Phelps",
    story: "Anxiety & Purpose",
    quote: "I think the biggest thing was learning to ask for help.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Selena Gomez",
    story: "Anxiety Management",
    quote: "If you are broken, you don't have to stay broken.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Ryan Reynolds",
    story: "Managing Anxiety",
    quote: "I have anxiety. I've always had anxiety.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  },
];

const StoryCard = ({ name, story, quote, image }) => (
  <div className="flex-shrink-0 w-[340px] glass-card-hover p-7 mx-4 group">
    <div className="flex items-center gap-4 mb-5">
      <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div>
        <h3 className="font-semibold text-foreground text-lg">{name}</h3>
        <p className="text-sm text-primary font-medium">{story}</p>
      </div>
    </div>
    <div className="relative">
      <Quote className="w-8 h-8 text-primary/20 absolute -top-1 -left-1" />
      <p className="text-muted-foreground leading-relaxed pl-8 italic">
        "{quote}"
      </p>
    </div>
  </div>
);

const InspiringStoriesSection = () => {
  // Duplicate stories for seamless loop
  const duplicatedStories = [...stories, ...stories];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  const handleSwipe = (e) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchEnd = (endEvent) => {
      const endX = endEvent.changedTouches[0].clientX;
      if (startX - endX > 50) {
        handleNext();
      } else if (endX - startX > 50) {
        handlePrev();
      }
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <section id="stories" className="py-28 bg-gradient-section overflow-hidden relative">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto px-4 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            Real Stories
          </span>
          <h2 className="section-title">
            Stories of Strength & Hope
          </h2>
          <p className="section-subtitle">
            Inspiring journeys from people who overcame their mental health challenges.
          </p>
        </motion.div>
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative px-4">
        <div className="relative overflow-hidden">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            onTouchStart={handleSwipe}
          >
            <StoryCard {...stories[currentIndex]} />
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary w-6" : "bg-primary/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Marquee */}
      <div className="hidden md:block relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {duplicatedStories.map((story, index) => (
            <StoryCard key={`${story.name}-${index}`} {...story} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InspiringStoriesSection;
