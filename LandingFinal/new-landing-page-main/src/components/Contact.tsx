import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import mountainPeace from '@/assets/mountain-peace.jpg';

const Contact = () => {
  return (
    <section 
      id="contact" 
      className="relative py-32 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mountainPeace})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white animate-fade-in-up leading-tight">
            You Deserve to Feel Okay Again
          </h2>
          <p className="text-xl md:text-2xl text-white/90 animate-fade-in-up animation-delay-200">
            Join thousands of students who found their peace
          </p>
          <div className="animate-fade-in-up animation-delay-400">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-7 text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
