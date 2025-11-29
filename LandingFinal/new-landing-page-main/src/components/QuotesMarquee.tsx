import { useEffect, useState } from 'react';

const QuotesMarquee = () => {
  const quotes = [
    "You're not lazy, you're burnt out.",
    "It's okay to pause.",
    "Your feelings are valid.",
    "You don't have to do this alone.",
    "Progress over perfection.",
    "Rest is productive.",
    "You deserve kindness.",
    "Small steps count.",
    "Your mental health matters.",
    "You're doing better than you think.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-muted rounded-3xl p-8 md:p-12 shadow-lg overflow-hidden">
            <h3 className="text-xl font-semibold text-foreground/60 mb-6 text-center">
              A Gentle Reminder
            </h3>
            <div className="relative h-32 flex items-center justify-center">
              {quotes.map((quote, index) => (
                <p
                  key={index}
                  className={`absolute text-2xl md:text-4xl font-script text-center text-primary transition-all duration-700 ${
                    index === currentIndex
                      ? 'opacity-100 translate-y-0'
                      : index === (currentIndex - 1 + quotes.length) % quotes.length
                      ? 'opacity-0 -translate-y-8'
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  "{quote}"
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuotesMarquee;