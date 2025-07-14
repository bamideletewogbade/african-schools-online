
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function Hero() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleGetStarted = () => {
    if (user && profile?.onboarding_completed) {
      navigate('/dashboard');
    } else if (user) {
      navigate('/onboarding');
    } else {
      navigate('/auth');
    }
  };

  const handleLearnMore = () => {
    navigate('/school-finder');
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-60"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-accent opacity-20 rounded-full blur-2xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary/20 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-soft hover:shadow-card transition-all duration-300 hover:scale-105">
              <Sparkles className="h-4 w-4" />
              Your Educational Journey Starts Here
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight animate-fade-up">
              Find Your Perfect School in Ghana
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-up">
              Discover, compare, and connect with the best educational institutions across Ghana. 
              Get personalized recommendations and guidance for your academic future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-up">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-4 text-lg rounded-xl shadow-hero hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              {user && profile?.onboarding_completed ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleLearnMore}
              className="px-8 py-4 text-lg rounded-xl border-2 border-primary/30 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              Explore Schools
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-up">
            <div className="text-center group">
              <div className="bg-gradient-card w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-card group-hover:shadow-soft transition-all duration-300 group-hover:scale-110">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">500+ Schools</h3>
              <p className="text-muted-foreground leading-relaxed">From primary to tertiary institutions across all regions</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-card w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-card group-hover:shadow-soft transition-all duration-300 group-hover:scale-110">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Expert Guidance</h3>
              <p className="text-muted-foreground leading-relaxed">Connect with mentors and educational counselors</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-card w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-card group-hover:shadow-soft transition-all duration-300 group-hover:scale-110">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Career Insights</h3>
              <p className="text-muted-foreground leading-relaxed">Get recommendations based on your career goals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
