import { Waves, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[hsl(215,35%,12%)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-ocean-glow flex items-center justify-center shadow-lg">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">SensEase</span>
            </div>
            <p className="text-white/60 leading-relaxed max-w-sm mb-5 text-sm">
              Empowering educational institutions with comprehensive mental wellness solutions. 
              Because every mind matters.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Twitter, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/80 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "#home" },
                { label: "Features", href: "#features" },
                { label: "Stories", href: "#stories" },
                { label: "About Us", href: "#about" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} SensEase. All rights reserved.
            </p>
            <p className="text-white/50 text-xs">
              Made with 💙 for student mental wellness
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
