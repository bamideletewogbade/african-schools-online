
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, TrendingUp } from "lucide-react";
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
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              Your Educational Journey Starts Here
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent leading-tight">
              Find Your Perfect School in Ghana
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover, compare, and connect with the best educational institutions across Ghana. 
              Get personalized recommendations and guidance for your academic future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={handleGetStarted} className="group">
              {user && profile?.onboarding_completed ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleLearnMore}>
              Explore Schools
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">500+ Schools</h3>
              <p className="text-muted-foreground text-sm">From primary to tertiary institutions across all regions</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expert Guidance</h3>
              <p className="text-muted-foreground text-sm">Connect with mentors and educational counselors</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Career Insights</h3>
              <p className="text-muted-foreground text-sm">Get recommendations based on your career goals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
