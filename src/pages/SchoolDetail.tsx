import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Star, Users, BookOpen, Phone, Mail, Globe, 
  Calendar, Award, Building, GraduationCap, ArrowLeft 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SchoolNews } from '@/components/SchoolNews';

interface School {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url?: string;
  cover_image_url?: string;
  school_type: 'public' | 'private';
  education_levels: string[];
  curriculum_types: string[];
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  established_year?: number;
  rating: number;
  total_reviews: number;
  featured: boolean;
  verified: boolean;
  student_population?: number;
  teacher_student_ratio?: string;
  facilities?: string[];
  extracurricular_activities?: string[];
  regions?: {
    name: string;
  };
}

export default function SchoolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchSchool();
    }
  }, [slug]);

  const fetchSchool = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          regions (
            name
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setSchool(data);
    } catch (error: any) {
      console.error('Error fetching school:', error);
      toast({
        title: "Error",
        description: "Failed to fetch school details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderEducationLevels = (levels: string[]) => {
    const levelMap: { [key: string]: string } = {
      'creche': 'Creche',
      'primary': 'Primary',
      'jhs': 'JHS',
      'shs': 'SHS',
      'tertiary': 'Tertiary'
    };
    return levels.map(level => levelMap[level] || level);
  };

  const renderCurriculumTypes = (types: string[]) => {
    const typeMap: { [key: string]: string } = {
      'ghanaian': 'Ghanaian',
      'british': 'British',
      'american': 'American',
      'ib': 'International Baccalaureate',
      'french': 'French',
      'other': 'Other'
    };
    return types.map(type => typeMap[type] || type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading school details...</div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">School not found</h1>
            <Button onClick={() => navigate('/school-finder')}>
              Back to School Finder
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/school-finder')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to School Finder
        </Button>

        {/* Hero Section */}
        <div className="relative mb-8">
          {school.cover_image_url && (
            <div className="h-64 rounded-lg overflow-hidden mb-6">
              <img
                src={school.cover_image_url}
                alt={school.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {school.logo_url && (
                  <img
                    src={school.logo_url}
                    alt={`${school.name} logo`}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold mb-2">{school.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{school.city}, {school.regions?.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {school.verified && (
                  <Badge variant="secondary">Verified</Badge>
                )}
                {school.featured && (
                  <Badge>Featured</Badge>
                )}
                <Badge variant={school.school_type === 'private' ? 'default' : 'secondary'}>
                  {school.school_type}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{school.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({school.total_reviews} reviews)</span>
                </div>
                {school.student_population && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{school.student_population} students</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{school.description}</p>
                  
                  <div className="space-y-3">
                    {school.established_year && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Established in {school.established_year}</span>
                      </div>
                    )}
                    
                    {school.teacher_student_ratio && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Teacher-Student Ratio: {school.teacher_student_ratio}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {renderEducationLevels(school.education_levels).map((level, index) => (
                      <Badge key={index} variant="outline">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Curriculum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {renderCurriculumTypes(school.curriculum_types).map((curriculum, index) => (
                      <Badge key={index} variant="outline">
                        {curriculum}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {renderEducationLevels(school.education_levels).map((level, index) => (
                      <div key={index} className="text-sm">{level}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="facilities">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Facilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {school.facilities && school.facilities.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {school.facilities.map((facility, index) => (
                        <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                          {facility}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No facilities information available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Extracurricular Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {school.extracurricular_activities && school.extracurricular_activities.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {school.extracurricular_activities.map((activity, index) => (
                        <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                          {activity}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No activities information available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news">
            <SchoolNews schoolId={school.id} />
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {school.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{school.address}</p>
                      </div>
                    </div>
                  )}

                  {school.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{school.phone}</p>
                      </div>
                    </div>
                  )}

                  {school.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{school.email}</p>
                      </div>
                    </div>
                  )}

                  {school.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a 
                          href={school.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {school.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
