import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Users, Brain, MapPin, Star } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Smart School Finder",
      description: "Search and filter schools by level, curriculum, location, and facilities. Compare up to 3 schools side by side.",
      cta: "Find Schools"
    },
    {
      icon: BookOpen,
      title: "Course Match & Pathways",
      description: "Get AI-powered course recommendations and career roadmaps tailored to your interests and goals.",
      cta: "Match Courses"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Receive personalized recommendations and detailed comparisons powered by advanced AI technology.",
      cta: "Learn More"
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Connect with education counselors and mentors for personalized guidance on your academic journey.",
      cta: "Get Guidance"
    },
    {
      icon: MapPin,
      title: "Study Abroad Support",
      description: "Explore international education opportunities and get assistance with study abroad applications.",
      cta: "Explore Options"
    },
    {
      icon: Star,
      title: "Verified Reviews",
      description: "Read authentic reviews and ratings from students and parents to make informed decisions.",
      cta: "Read Reviews"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need for Educational Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From finding the right school to choosing your career path, we provide comprehensive 
            tools and expert guidance every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-soft transition-shadow duration-300 border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </CardDescription>
                <Button variant="outline" className="w-full">
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