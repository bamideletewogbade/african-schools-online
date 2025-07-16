
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CourseMatchEngine } from '@/components/CourseMatchEngine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Award, TrendingUp, Brain, Route, MessageSquare, Globe } from 'lucide-react';

export default function CourseMatch() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">AI-Powered Course Match</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover your perfect education pathway with our intelligent course matching engine, 
              AI career roadmap generator, and personalized recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <Brain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI Career Roadmap</CardTitle>
                <CardDescription>
                  Get personalized career guidance powered by Google Gemini AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Smart Course Match</CardTitle>
                <CardDescription>
                  Find courses based on your school, country, and career preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Route className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Pathway Builder</CardTitle>
                <CardDescription>
                  Build your education journey with suggestion history
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Access mentoring, counseling & study abroad services
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {user && profile ? (
            <div className="space-y-8">
              <CourseMatchEngine />

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <MessageSquare className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Mentoring Services</CardTitle>
                    <CardDescription>
                      Connect with experienced mentors in your field of interest
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Request Mentoring
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Award className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Career Counseling</CardTitle>
                    <CardDescription>
                      Get professional guidance on your career decisions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Book Counseling
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Globe className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Study Abroad</CardTitle>
                    <CardDescription>
                      Explore international education opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Explore Options
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Get Started with Course Matching</CardTitle>
                <CardDescription>
                  Sign up and complete your profile to access our AI-powered course matching engine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">1</div>
                      <div>
                        <h3 className="font-medium">Create Your Profile</h3>
                        <p className="text-sm text-muted-foreground">Tell us about your education level and career interests</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">2</div>
                      <div>
                        <h3 className="font-medium">Get AI Recommendations</h3>
                        <p className="text-sm text-muted-foreground">Receive personalized course and career guidance</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">3</div>
                      <div>
                        <h3 className="font-medium">Build Your Pathway</h3>
                        <p className="text-sm text-muted-foreground">Create a step-by-step plan to achieve your goals</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">4</div>
                      <div>
                        <h3 className="font-medium">Connect with Services</h3>
                        <p className="text-sm text-muted-foreground">Access mentoring, counseling, and study abroad options</p>
                      </div>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <a href="/auth">Sign Up Now</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
