import { useState } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import InspiringStoriesSection from "./InspiringStoriesSection";
import AboutSection from "./AboutSection";
import Footer from "./Footer";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@components/ui/dialog";
import Login from "@components/auth/Login";

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
      <HeroSection />
      <FeaturesSection />
      <InspiringStoriesSection />
      <AboutSection />
      <Footer />

      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg p-6 border-0 overflow-hidden bg-white shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">Login</DialogTitle>
          <Login onLoginSuccess={() => setIsLoginModalOpen(false)} isModal={true} />
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default LandingPage;
