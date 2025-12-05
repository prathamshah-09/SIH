import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import InspiringStoriesSection from "./InspiringStoriesSection";
import AboutSection from "./AboutSection";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <InspiringStoriesSection />
      <AboutSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
