import { BookOpen, Map, MessageCircle, Sparkles, Target, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { Header } from '@/components/Header';

const features = [
  {
    icon: Map,
    title: 'Personalized Roadmaps',
    description: 'Get a clear learning path tailored to your goals and current skill level.',
  },
  {
    icon: BookOpen,
    title: 'Curated Free Resources',
    description: 'Access the best free tutorials, courses, and documentation for each topic.',
  },
  {
    icon: Target,
    title: 'Practice Tasks',
    description: 'Hands-on exercises and mini-projects to reinforce what you learn.',
  },
  {
    icon: MessageCircle,
    title: 'AI Teacher Chat',
    description: 'Get instant help and explanations while you code, like having a teacher by your side.',
  },
];

const benefits = [
  'No more tutorial hell - follow a clear path',
  'Free resources curated by experts',
  'Practice with real projects',
  'AI teacher available 24/7',
];

export default function Index() {
  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-up">
            <Sparkles className="h-4 w-4" />
            AI-Powered Learning Guidance
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Stop Guessing.
            <br />
            <span className="text-gradient">Start Learning.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
            SkillPilot is your AI-powered learning companion. Get personalized roadmaps, 
            curated resources, and instant help - all in one place.
          </p>

          <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
            <SearchBar size="large" />
          </div>

          {/* Benefits Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-up" style={{ animationDelay: '400ms' }}>
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border shadow-sm text-sm"
              >
                <CheckCircle className="h-4 w-4 text-accent" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Learn Effectively</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            SkillPilot combines AI intelligence with proven learning methods to help you master any skill.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group p-6 rounded-xl bg-card border shadow-card hover:shadow-hover transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-gradient">SkillPilot</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your learning journey.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Enter Your Goal',
                description: 'Tell us what you want to learn - frontend, AI, algorithms, or anything else.',
                icon: Target,
              },
              {
                step: '02',
                title: 'Get Your Roadmap',
                description: 'Receive a personalized learning path with resources and practice tasks.',
                icon: Map,
              },
              {
                step: '03',
                title: 'Learn with AI',
                description: 'Ask questions anytime. Your AI teacher helps you understand and practice.',
                icon: Zap,
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-soft">
                    <item.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-bold text-primary mb-2 block">STEP {item.step}</span>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto text-center p-10 rounded-2xl gradient-primary text-primary-foreground shadow-soft">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Master a New Skill?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of learners who have accelerated their growth with SkillPilot's AI-powered guidance.
          </p>
          <div className="max-w-md mx-auto">
            <SearchBar placeholder="What will you learn today?" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 SkillPilot. Built for Microsoft Hackathon.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Powered by AI</span>
            <span>•</span>
            <span>Azure Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
