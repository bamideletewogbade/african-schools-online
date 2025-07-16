
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader, MapPin, Clock, TrendingUp, BookOpen } from 'lucide-react';

interface CourseMatchFormData {
  targetCareer: string;
  timeline: string;
  learningStyle: string;
  budget: string;
  availability: string;
}

export function CourseMatchEngine() {
  const { user, profile } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);

  const form = useForm<CourseMatchFormData>({
    defaultValues: {
      targetCareer: '',
      timeline: '2-3 years',
      learningStyle: 'mixed',
      budget: 'moderate',
      availability: 'part-time'
    }
  });

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: schools } = useQuery({
    queryKey: ['schools-with-regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*, regions(name)')
        .order('rating', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const generateRoadmap = async (formData: CourseMatchFormData) => {
    if (!user || !profile) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-career-roadmap', {
        body: {
          profileData: profile,
          preferences: formData
        }
      });

      if (error) throw error;
      setRoadmapData(data);
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: CourseMatchFormData) => {
    generateRoadmap(data);
  };

  if (!user || !profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            Please sign in and complete your profile to access the course matching engine.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Smart Course Match Engine
          </CardTitle>
          <CardDescription>
            Get personalized course and career recommendations based on your goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetCareer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Career</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Software Engineer, Doctor, Teacher" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1 year">1 Year</SelectItem>
                          <SelectItem value="2-3 years">2-3 Years</SelectItem>
                          <SelectItem value="3-5 years">3-5 Years</SelectItem>
                          <SelectItem value="5+ years">5+ Years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="learningStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select learning style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="online">Online Learning</SelectItem>
                          <SelectItem value="in-person">In-Person</SelectItem>
                          <SelectItem value="mixed">Mixed/Hybrid</SelectItem>
                          <SelectItem value="self-paced">Self-Paced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low (Under ₵5,000)</SelectItem>
                          <SelectItem value="moderate">Moderate (₵5,000 - ₵20,000)</SelectItem>
                          <SelectItem value="high">High (₵20,000+)</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating Your Career Roadmap...
                  </>
                ) : (
                  'Generate Career Roadmap'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {roadmapData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{roadmapData.careerRoadmap?.title || 'Your Career Roadmap'}</CardTitle>
              <CardDescription>{roadmapData.careerRoadmap?.overview}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roadmapData.careerRoadmap?.phases?.map((phase: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">{phase.phase}</h3>
                      <span className="text-sm text-muted-foreground">({phase.duration})</span>
                    </div>
                    <p className="text-sm mb-3">{phase.description}</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Milestones:</h4>
                        <ul className="text-sm space-y-1">
                          {phase.milestones?.map((milestone: string, i: number) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-primary">•</span>
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Skills to Develop:</h4>
                        <ul className="text-sm space-y-1">
                          {phase.skills?.map((skill: string, i: number) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-primary">•</span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roadmapData.courseRecommendations?.map((course: any, index: number) => (
                    <div key={index} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{course.courseName}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          course.priority === 'high' ? 'bg-red-100 text-red-700' :
                          course.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {course.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{course.reason}</p>
                      <p className="text-xs text-muted-foreground">Best time: {course.timing}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  School Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roadmapData.schoolRecommendations?.map((school: any, index: number) => (
                    <div key={index} className="border rounded p-3">
                      <h4 className="font-medium mb-1">{school.schoolName}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{school.reason}</p>
                      <div className="text-xs">
                        <span className="font-medium">Programs: </span>
                        {school.programs?.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {roadmapData.careerOutlook && (
            <Card>
              <CardHeader>
                <CardTitle>Career Outlook</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Job Market</h4>
                    <p className="text-sm text-muted-foreground">{roadmapData.careerOutlook.jobMarket}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Salary Range</h4>
                    <p className="text-sm text-muted-foreground">{roadmapData.careerOutlook.salaryRange}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Growth Potential</h4>
                    <p className="text-sm text-muted-foreground">{roadmapData.careerOutlook.growth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {roadmapData.nextSteps && (
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmapData.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
