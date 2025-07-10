import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';

const STEPS = [
  { id: 1, title: "User Type", description: "Tell us about yourself" },
  { id: 2, title: "Education", description: "Your current education level" },
  { id: 3, title: "Interests", description: "Your career goals" },
  { id: 4, title: "Location", description: "Your preferences" }
];

const CAREER_INTERESTS = [
  'Medicine & Healthcare',
  'Engineering & Technology',
  'Business & Finance',
  'Education & Teaching',
  'Law & Legal Services',
  'Arts & Creative',
  'Agriculture',
  'Sports & Recreation',
  'Public service',
  'Entrepreneurship',
  'Science & Research',
  'Tourism & Hospitality'
];

const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Central',
  'Volta',
  'Eastern',
  'Northern',
  'Upper East',
  'Upper West',
  'Brong Ahafo',
  'Western North',
  'Ahafo',
  'Bono East',
  'Oti',
  'North East',
  'Savannah'
];

export default function Onboarding() {
  const { user, profile, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    currentEducationLevel: '',
    careerInterests: [] as string[],
    preferredLocation: '',
    preferredCountry: 'Ghana'
  });

  // Redirect if not authenticated or already onboarded
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.onboarding_completed) {
    return <Navigate to="/" replace />;
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCareerInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      careerInterests: prev.careerInterests.includes(interest)
        ? prev.careerInterests.filter(i => i !== interest)
        : [...prev.careerInterests, interest]
    }));
  };

  const handleComplete = async () => {
    const updates = {
      role: formData.role as 'student' | 'graduate',
      current_education_level: formData.currentEducationLevel as 'creche' | 'primary' | 'jhs' | 'shs' | 'tertiary',
      career_interests: formData.careerInterests,
      preferred_location: formData.preferredLocation,
      preferred_country: formData.preferredCountry,
      onboarding_completed: true
    };

    const { error } = await updateProfile(updates);
    
    if (!error) {
      navigate('/', { replace: true });
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.role !== '';
      case 2:
        return formData.currentEducationLevel !== '';
      case 3:
        return formData.careerInterests.length > 0;
      case 4:
        return formData.preferredLocation !== '';
      default:
        return false;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Help us personalize your experience on Africa Schools Online
          </CardDescription>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">What describes you best?</h3>
                <div className="space-y-3">
                  <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={formData.role === 'student'}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    />
                    <div>
                      <p className="font-medium">Student</p>
                      <p className="text-sm text-muted-foreground">Currently in school or looking to enroll</p>
                    </div>
                  </Label>
                  <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="role"
                      value="graduate"
                      checked={formData.role === 'graduate'}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    />
                    <div>
                      <p className="font-medium">Graduate</p>
                      <p className="text-sm text-muted-foreground">Completed education or seeking further studies</p>
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="education-level" className="text-lg font-semibold">
                  What's your current education level?
                </Label>
                <Select
                  value={formData.currentEducationLevel}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currentEducationLevel: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creche">Creche/Nursery</SelectItem>
                    <SelectItem value="primary">Primary School</SelectItem>
                    <SelectItem value="jhs">Junior High School (JHS)</SelectItem>
                    <SelectItem value="shs">Senior High School (SHS)</SelectItem>
                    <SelectItem value="tertiary">Tertiary/University</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">What are your career interests?</h3>
                <p className="text-sm text-muted-foreground mb-4">Select all that apply (you can change these later)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CAREER_INTERESTS.map((interest) => (
                    <Label 
                      key={interest}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={formData.careerInterests.includes(interest)}
                        onCheckedChange={() => handleCareerInterestToggle(interest)}
                      />
                      <span className="text-sm">{interest}</span>
                    </Label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-lg font-semibold">
                  Which region of Ghana interests you most?
                </Label>
                <Select
                  value={formData.preferredLocation}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, preferredLocation: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {GHANA_REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || loading}
              >
                {loading ? 'Completing...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}