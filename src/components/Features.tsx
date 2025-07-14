
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Users, Brain, MapPin, Star } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Smart School Finder",
      description: "Search and filter schools by level, curriculum, location, and facilities. Compare up to 3 schools side by side.",
      cta: "Find Schools",
      gradient: "from-primary/10 to-accent/10"
    },
    {
      icon: BookOpen,
      title: "Course Match & Pathways",
      description: "Get AI-powered course recommendations and career roadmaps tailored to your interests and goals.",
      cta: "Match Courses",
      gradient: "from-accent/10 to-primary/10"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Receive personalized recommendations and detailed comparisons powered by advanced AI technology.",
      cta: "Learn More",
      gradient: "from-primary/15 to-accent/5"
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Connect with education counselors and mentors for personalized guidance on your academic journey.",
      cta: "Get Guidance",
      gradient: "from-accent/15 to-primary/5"
    },
    {
      icon: MapPin,
      title: "Study Abroad Support",
      description: "Explore international education opportunities and get assistance with study abroad applications.",
      cta: "Explore Options",
      gradient: "from-primary/10 to-accent/15"
    },
    {
      icon: Star,
      title: "Verified Reviews",
      description: "Read authentic reviews and ratings from students and parents to make informed decisions.",
      cta: "Read Reviews",
      gradient: "from-accent/10 to-primary/15"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-subtle opacity-40"></div>
      <div className="absolute top-40 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 animate-fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Everything You Need for Educational Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From finding the right school to choosing your career path, we provide comprehensive 
            tools and expert guidance every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group relative bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border-white/20 shadow-card hover:shadow-hero transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-up overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-muted-foreground mb-8 leading-relaxed text-base">
                  {feature.description}
                </CardDescription>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/80 backdrop-blur-sm border-primary/30 hover:bg-white hover:border-primary/50 hover:text-primary transition-all duration-300 group-hover:scale-105"
                >
                  {feature.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
