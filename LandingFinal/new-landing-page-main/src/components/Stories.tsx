import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const Stories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const stories = [
    {
      initial: 'A',
      quote: 'From panic attacks before exams to sleeping peacefully in 2 weeks.',
      name: 'Aisha',
      age: 21,
      story: 'I thought anxiety was just part of being a student. SensEase helped me realize I deserved peace, not constant worry.',
      tags: ['Anxiety', 'Exams'],
      color: 'bg-sky/40',
    },
    {
      initial: 'R',
      quote: 'I finally told someone about my depression without fear.',
      name: 'Rohan',
      age: 19,
      story: "The anonymous counselors gave me courage. Now I'm talking to my family too, and it feels like a weight lifted.",
      tags: ['Depression', 'Support'],
      color: 'bg-secondary/30',
    },
    {
      initial: 'P',
      quote: 'The nightly anxiety voice notes literally saved me during placements.',
      name: 'Priya',
      age: 20,
      story: 'Recording my thoughts at 3 AM helped me process rejection and keep going. Got my dream job eventually!',
      tags: ['Career Stress', 'Resilience'],
      color: 'bg-accent/40',
    },
    {
      initial: 'A',
      quote: 'Found friends who actually get hostels & ragging stress.',
      name: 'Arjun',
      age: 22,
      story: 'The peer community made me realize thousands face the same struggles. Not alone anymore.',
      tags: ['Community', 'College Life'],
      color: 'bg-butter/50',
    },
    {
      initial: 'S',
      quote: 'Gratitude journaling here changed my entire mood.',
      name: 'Sneha',
      age: 19,
      story: '5 minutes every night listing what went right. Simple, but transformed how I see my days.',
      tags: ['Journaling', 'Positivity'],
      color: 'bg-sky/40',
    },
    {
      initial: 'V',
      quote: 'Talking to a counsellor at 3 AM felt like magic.',
      name: 'Vikram',
      age: 21,
      story: 'When the darkness felt overwhelming, having someone there - anytime - made all the difference.',
      tags: ['Crisis Support', 'Counseling'],
      color: 'bg-secondary/30',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="stories" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
            You're Not Alone
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real students, real stories, real healing
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card shadow-lg hidden md:flex hover:scale-110 transition-transform"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 snap-center group"
              >
                <div
                  className={`${story.color} p-8 rounded-3xl h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border border-border/30`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center text-2xl font-script text-primary shadow-md">
                      {story.initial}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-lg">
                        {story.name}, {story.age}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg font-medium text-foreground mb-4 leading-relaxed">
                    "{story.quote}"
                  </p>

                  <p className="text-foreground/70 mb-4 leading-relaxed">
                    {story.story}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {story.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-card rounded-full text-xs font-medium text-foreground/80 shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card shadow-lg hidden md:flex hover:scale-110 transition-transform"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Stories;