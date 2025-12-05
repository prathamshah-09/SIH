import { useState } from 'react';
import { Brain, Headphones, UserCircle, BookOpen, Users, TrendingUp, Phone, Heart, MapPin } from 'lucide-react';

const RadialTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: '24/7 AI Listener',
      description: 'Talk anytime, no judgment. Your personal companion that understands.',
      color: 'hsl(var(--sky))',
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Guided Audio Library',
      description: 'Sleep, focus, anxiety relief, and breathing exercises on demand.',
      color: 'hsl(var(--accent))',
    },
    {
      icon: <UserCircle className="w-8 h-8" />,
      title: 'Book Real Counselors',
      description: 'Verified therapists who truly understand student life.',
      color: 'hsl(var(--secondary))',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Daily Mood Check-in',
      description: '10-second check-ins to track your emotional journey.',
      color: 'hsl(var(--butter))',
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Emergency Toolkit',
      description: 'Crisis lines, grounding exercises, and your personal safety plan.',
      color: 'hsl(var(--sky))',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Peer Community',
      description: 'Anonymous student forums. Share, connect, heal together.',
      color: 'hsl(var(--accent))',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Personalized Plan',
      description: 'Weekly wellness plan built just for you and your needs.',
      color: 'hsl(var(--secondary))',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Journal with Prompts',
      description: 'Guided reflections that actually help you process emotions.',
      color: 'hsl(var(--butter))',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Campus Resources',
      description: 'Find mental health services available at your university.',
      color: 'hsl(var(--sky))',
    },
  ];

  const radius = 280;
  const centerX = 320;
  const centerY = 320;

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
            Everything Your Mind Needs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            In one safe, supportive space
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-7xl mx-auto">
          {/* Radial Timeline */}
          <div className="relative w-full max-w-[640px] h-[640px] hidden lg:block">
            <svg className="w-full h-full" viewBox="0 0 640 640">
              {/* Center circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r="60"
                fill="hsl(var(--primary))"
                className="transition-all duration-500"
              />
              
              {/* Orbital circles and connecting lines */}
              {features.map((feature, index) => {
                const angle = (index * 360) / features.length - 90;
                const radian = (angle * Math.PI) / 180;
                const x = centerX + radius * Math.cos(radian);
                const y = centerY + radius * Math.sin(radian);
                const isActive = index === activeIndex;

                return (
                  <g key={index}>
                    {/* Connecting line */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={x}
                      y2={y}
                      stroke={isActive ? feature.color : 'hsl(var(--border))'}
                      strokeWidth={isActive ? '3' : '1'}
                      className="transition-all duration-500"
                      opacity={isActive ? '1' : '0.3'}
                    />
                    
                    {/* Orbital circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? '50' : '40'}
                      fill="hsl(var(--card))"
                      stroke={feature.color}
                      strokeWidth="3"
                      className="cursor-pointer transition-all duration-500 hover:r-[50]"
                      onClick={() => setActiveIndex(index)}
                      style={{
                        filter: isActive ? `drop-shadow(0 0 20px ${feature.color})` : 'none'
                      }}
                    />
                    
                    {/* Icon positioning (approximate) */}
                    <foreignObject
                      x={x - 20}
                      y={y - 20}
                      width="40"
                      height="40"
                      className="pointer-events-none"
                    >
                      <div className="flex items-center justify-center w-full h-full text-primary">
                        {feature.icon}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Feature Details */}
          <div className="w-full lg:w-[500px]">
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/30 min-h-[300px] transition-all duration-500">
              <div 
                className="flex items-center gap-4 mb-6"
                style={{ color: features[activeIndex].color }}
              >
                <div className="p-4 bg-background rounded-2xl shadow-md">
                  {features[activeIndex].icon}
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  {features[activeIndex].title}
                </h3>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {features[activeIndex].description}
              </p>
            </div>

            {/* Feature Navigation Dots */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeIndex
                      ? 'w-12 h-3'
                      : 'w-3 h-3 hover:scale-125'
                  }`}
                  style={{
                    backgroundColor: index === activeIndex ? feature.color : 'hsl(var(--border))',
                  }}
                  aria-label={feature.title}
                />
              ))}
            </div>
          </div>

          {/* Mobile Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden w-full max-w-4xl">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-3xl border border-border/30 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-2xl shadow-md flex-shrink-0"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <div style={{ color: feature.color }}>
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadialTimeline;
