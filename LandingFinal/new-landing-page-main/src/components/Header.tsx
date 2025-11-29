import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X, Moon, Sun } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-md shadow-sm dark:shadow-md dark:shadow-primary/10">
      {/* Tubelight effect */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ease-out"
        style={{
          width: scrolled ? '100%' : '0%',
          opacity: scrolled ? 1 : 0
        }}
      />
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/src/assets/sensease-logo.png" alt="SensEase Logo" className="w-10 h-10" />
            <h1 className="text-2xl md:text-3xl font-display font-bold">
              <span className="text-primary">Sens</span>
              <span className="text-foreground">Ease</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('stories')}
              className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold"
            >
              Stories
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold"
            >
              Contact
            </button>
            <Button
              onClick={() => setDarkMode(!darkMode)}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button className="rounded-full px-6">Login</Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={() => setDarkMode(!darkMode)}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('home')}
                className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('stories')}
                className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold text-left"
              >
                Stories
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold text-left"
              >
                Contact
              </button>
              <Button className="rounded-full w-full">Login</Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;