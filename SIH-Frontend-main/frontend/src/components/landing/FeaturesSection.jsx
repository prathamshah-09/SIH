import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bot,
  Music,
  BookOpen,
  PenLine,
  ClipboardCheck,
  Calendar,
  MessageCircle,
  Users,
  BarChart3,
  Megaphone,
  FileText,
  Shield,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "../../lib/utils";

const studentFeatures = [
  {
    icon: User,
    title: "Anonymous Profile",
    description: "Express yourself freely with complete privacy and anonymity.",
  },
  {
    icon: Bot,
    title: "AI Mental Health Chatbot",
    description: "24/7 support through text and voice conversations with our AI companion.",
  },
  {
    icon: Music,
    title: "Soothing Meditation Audio",
    description: "Curated meditation and relaxation audio to calm your mind.",
  },
  {
    icon: BookOpen,
    title: "Self-Help Resources",
    description: "Access books, videos, and articles for personal growth.",
  },
  {
    icon: PenLine,
    title: "Daily/Weekly Journaling",
    description: "Track your thoughts and emotions with guided journaling.",
  },
  {
    icon: ClipboardCheck,
    title: "Mental Health Assessments",
    description: "Regular check-ins to understand your mental wellness journey.",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description: "Schedule sessions with professional counselors easily.",
  },
  {
    icon: Users,
    title: "Community Group Chats",
    description: "Connect with peers in safe, moderated support groups.",
  },
  {
    icon: MessageCircle,
    title: "One-to-One Messaging",
    description: "Private conversations with certified counselors.",
  },
];

const counselorFeatures = [
  {
    icon: Bot,
    title: "AI Assistant",
    description: "AI-powered tools to enhance counseling effectiveness.",
  },
  {
    icon: Calendar,
    title: "Appointment Management",
    description: "Efficiently manage and track student sessions.",
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Access and share professional mental health resources.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track progress and outcomes with detailed insights.",
  },
  {
    icon: MessageCircle,
    title: "Secure Messaging",
    description: "Encrypted communication with students.",
  },
];

const adminFeatures = [
  {
    icon: Users,
    title: "User Management",
    description: "Manage students, counselors, and administrators.",
  },
  {
    icon: Shield,
    title: "Community Moderation",
    description: "Create and monitor safe community spaces.",
  },
  {
    icon: Megaphone,
    title: "Announcements",
    description: "Broadcast important updates to the campus.",
  },
  {
    icon: FileText,
    title: "Form Builder",
    description: "Create custom assessments and feedback forms.",
  },
  {
    icon: BarChart3,
    title: "Platform Analytics",
    description: "Comprehensive insights into platform usage and impact.",
  },
];

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    className="group glass-card-hover p-6"
  >
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-ocean-glow/20 flex items-center justify-center mb-5 group-hover:from-primary/30 group-hover:to-ocean-glow/30 transition-all duration-300">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed hidden sm:block">{description}</p>
  </motion.div>
);

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-radial-blue opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            What We Offer
          </span>
          <h2 className="section-title">
            Our Key Features
          </h2>
          <p className="section-subtitle">
            Comprehensive tools designed to support mental wellness across your campus community.
          </p>
        </motion.div>

        <Tabs defaultValue="students" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-transparent h-auto mb-14">
            {[
              { value: "students", label: "For Students" },
              { value: "counselors", label: "For Counselors" },
              { value: "admins", label: "For Admins" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "px-4 sm:px-8 py-2 sm:py-3.5 rounded-full font-semibold transition-all duration-300 border-2 text-xs sm:text-sm",
                  "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-ocean-glow data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-button",
                  "data-[state=inactive]:bg-card data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:border-primary/40 data-[state=inactive]:hover:text-foreground"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="students" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentFeatures.map((feature, index) => (
                <FeatureCard key={feature.title} {...feature} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="counselors" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {counselorFeatures.map((feature, index) => (
                <FeatureCard key={feature.title} {...feature} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="admins" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {adminFeatures.map((feature, index) => (
                <FeatureCard key={feature.title} {...feature} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturesSection;
