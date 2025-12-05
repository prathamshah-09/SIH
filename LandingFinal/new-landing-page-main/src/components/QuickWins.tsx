import { Wind, Anchor, Sparkles, Activity } from 'lucide-react';

const QuickWins = () => {
  const exercises = [
    {
      icon: <Wind className="w-8 h-8" />,
      title: 'Breathing Exercise',
      description: '2-minute calm',
      color: 'bg-sky/40',
    },
    {
      icon: <Anchor className="w-8 h-8" />,
      title: 'Grounding Technique',
      description: 'Find your center',
      color: 'bg-accent/40',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Power Affirmation',
      description: 'Boost confidence',
      color: 'bg-secondary/30',
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Quick Stretch',
      description: 'Release tension',
      color: 'bg-butter/50',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
            Feel Better in 2 Minutes
          </h2>
          <p className="text-xl text-muted-foreground">
            Quick tools for instant relief
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className={`${exercise.color} p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border border-border/30 group text-center`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-card rounded-2xl text-primary shadow-md group-hover:rotate-12 transition-transform duration-300">
                  {exercise.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {exercise.title}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {exercise.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickWins;