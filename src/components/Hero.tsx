import { Button } from "@/components/ui/button";
import { ArrowRight, Search, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

const Hero = () => {
  return (
    <section 
      className="relative bg-gradient-hero text-primary-foreground py-20 lg:py-32 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(25 65% 45% / 0.85), hsl(45 85% 60% / 0.85)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-accent"> Educational Path</span>
            in Ghana
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Discover schools, match with courses, and get AI-powered guidance to make 
            informed educational decisions for your future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" variant="hero">
              <Search className="mr-2 h-5 w-5" />
              Find Schools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="hero-outline">
              <BookOpen className="mr-2 h-5 w-5" />
              Match Courses
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-primary-foreground/80">Schools Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">200+</div>
              <div className="text-primary-foreground/80">Career Paths</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">10K+</div>
              <div className="text-primary-foreground/80">Students Helped</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;