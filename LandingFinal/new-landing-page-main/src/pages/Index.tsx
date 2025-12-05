import Header from '../components/Header';
import Hero from '../components/Hero';
import QuotesMarquee from '../components/QuotesMarquee';
import Stories from '../components/Stories';
import RadialTimeline from '../components/RadialTimeline';
import QuickWins from '../components/QuickWins';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <Hero />
      <QuotesMarquee />
      <Stories />
      <RadialTimeline />
      <QuickWins />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
