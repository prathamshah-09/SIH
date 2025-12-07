import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Waves } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Inspiring Stories", href: "#stories" },
  { label: "About Us", href: "#about" },
];

const Navbar = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/70 backdrop-blur-xl shadow-soft border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#home");
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              isScrolled 
                ? "bg-gradient-to-br from-primary to-ocean-glow shadow-button" 
                : "bg-white/15 backdrop-blur-sm"
            )}>
              <Waves className={cn(
                "w-5 h-5 transition-colors",
                isScrolled ? "text-primary-foreground" : "text-white"
              )} />
            </div>
            <span
              className={cn(
                "text-xl font-bold transition-colors tracking-tight",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              SensEase
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                  isScrolled
                    ? "text-foreground/80 hover:text-primary hover:bg-primary/10"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <Button
              onClick={onLoginClick}
              variant="animated"
              className="px-6 rounded-lg"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2.5 rounded-xl transition-colors",
              isScrolled
                ? "text-foreground "
                : "text-white hover:bg-white/10"
            )}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border shadow-card transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="block w-full text-left px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button onClick={onLoginClick} className="block pt-2 w-full">
            <Button variant="animated" className="w-full rounded-lg">
              Login
            </Button>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
