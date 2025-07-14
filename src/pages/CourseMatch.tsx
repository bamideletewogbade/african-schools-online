
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

export default function CourseMatch() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Course Match</h1>
            <p className="text-lg text-muted-foreground">
              Find the perfect courses that match your interests and career goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>
                  Get course suggestions based on your education level and interests
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Career Guidance</CardTitle>
                <CardDescription>
                  Match courses with your career aspirations and goals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>
                  Learn from graduates who took similar paths
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {user && profile ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Course Recommendations</CardTitle>
                <CardDescription>
                  Based on your profile: {profile.current_education_level} level, interested in {profile.career_interests?.join(', ') || 'various fields'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Course matching functionality is coming soon! We'll analyze your profile and recommend the best courses for your career path.
                </p>
                <Button>Get My Recommendations</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Sign up to get personalized course recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/auth">Sign Up Now</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
