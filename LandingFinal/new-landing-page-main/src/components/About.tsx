import { Shield, Heart, Users } from 'lucide-react';
import studentsImage from '@/assets/students-discussion.jpg';

const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground animate-fade-in-up">
              Built by Students, For Students
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up animation-delay-200">
              Who've been exactly where you are
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Image */}
            <div className="order-2 lg:order-1 animate-fade-in-up animation-delay-300">
              <img 
                src={studentsImage} 
                alt="Students supporting each other" 
                className="rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="animate-fade-in-up animation-delay-400">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  We created SensEase because we know the struggle. Late-night anxiety before exams, 
                  the weight of expectations, feeling alone in a crowded campus. We've been there too.
                </p>
              </div>
              <div className="animate-fade-in-up animation-delay-500">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  This isn't just another app. It's a safe space built with care, understanding, and 
                  the genuine desire to help every student feel heard, supported, and hopeful.
                </p>
              </div>
              <div className="animate-fade-in-up animation-delay-600">
                <p className="text-lg text-foreground/80 leading-relaxed font-semibold text-foreground">
                  Because your mental health matters. And you deserve to feel okay again.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-sky/30 p-6 rounded-2xl text-center border border-border/30">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-card rounded-xl shadow-md">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-2">100% Anonymous</h3>
              <p className="text-sm text-foreground/70">Your privacy is sacred</p>
            </div>

            <div className="bg-accent/30 p-6 rounded-2xl text-center border border-border/30">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-card rounded-xl shadow-md">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-2">Free to Start</h3>
              <p className="text-sm text-foreground/70">Mental health shouldn't cost</p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-2xl text-center border border-border/30">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-card rounded-xl shadow-md">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-2">Made with Love</h3>
              <p className="text-sm text-foreground/70">By students who care</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;