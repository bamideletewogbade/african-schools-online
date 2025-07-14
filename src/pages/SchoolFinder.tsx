import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Star, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  rating: number;
  total_reviews: number;
  featured: boolean;
  verified: boolean;
  student_population?: number;
  facilities?: string[];
  regions?: {
    name: string;
  };
}

interface Region {
  id: string;
  name: string;
  code: string;
}

export default function SchoolFinder() {
  const [schools, setSchools] = useState<School[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCurriculum, setSelectedCurriculum] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegions();
    fetchSchools();
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [searchTerm, selectedRegion, selectedLevel, selectedType, selectedCurriculum]);

  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');

      if (error) throw error;
      setRegions(data || []);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const fetchSchools = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('schools')
        .select(`
          *,
          regions (
            name
          )
        `)
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (selectedRegion) {
        query = query.eq('region_id', selectedRegion);
      }

      if (selectedLevel) {
        query = query.contains('education_levels', [selectedLevel]);
      }

      if (selectedType) {
        query = query.eq('school_type', selectedType as 'public' | 'private');
      }

      if (selectedCurriculum) {
        query = query.contains('curriculum_types', [selectedCurriculum]);
      }

      const { data, error } = await query;

      if (error) throw error;
      console.log('Fetched schools:', data); // Debug log
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schools. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolClick = (school: School) => {
    navigate(`/school/${school.slug}`);
  };

  const renderEducationLevels = (levels: string[]) => {
    const levelMap: { [key: string]: string } = {
      'creche': 'Creche',
      'primary': 'Primary',
      'jhs': 'JHS',
      'shs': 'SHS',
      'tertiary': 'Tertiary'
    };

    return levels.map(level => levelMap[level] || level).join(' • ');
  };

  const renderCurriculumTypes = (types: string[]) => {
    const typeMap: { [key: string]: string } = {
      'ghanaian': 'Ghanaian',
      'british': 'British',
      'american': 'American',
      'ib': 'IB',
      'french': 'French',
      'other': 'Other'
    };

    return types.map(type => typeMap[type] || type);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedLevel('');
    setSelectedType('');
    setSelectedCurriculum('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Find Your Perfect School
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and compare educational institutions across Ghana, from creche to tertiary level
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Schools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search schools by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Education Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creche">Creche</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="jhs">JHS</SelectItem>
                  <SelectItem value="shs">SHS</SelectItem>
                  <SelectItem value="tertiary">Tertiary</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="School Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                <SelectTrigger>
                  <SelectValue placeholder="Curriculum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ghanaian">Ghanaian</SelectItem>
                  <SelectItem value="british">British</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="ib">International Baccalaureate</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || selectedRegion || selectedLevel || selectedType || selectedCurriculum) && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `Found ${schools.length} school${schools.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <Card 
              key={school.id} 
              className="hover-scale cursor-pointer shadow-subtle hover:shadow-elegant transition-all duration-300"
              onClick={() => handleSchoolClick(school)}
            >
              <div className="relative">
                {school.cover_image_url && (
                  <img
                    src={school.cover_image_url}
                    alt={school.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                {school.featured && (
                  <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                    Featured
                  </Badge>
                )}
                {school.verified && (
                  <Badge variant="secondary" className="absolute top-2 left-2">
                    Verified
                  </Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{school.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{school.city}, {school.regions?.name}</span>
                    </div>
                  </div>
                  {school.logo_url && (
                    <img
                      src={school.logo_url}
                      alt={`${school.name} logo`}
                      className="w-12 h-12 object-contain rounded"
                    />
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{school.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({school.total_reviews})</span>
                  </div>
                  {school.student_population && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{school.student_population} students</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription className="mb-4 line-clamp-2">
                  {school.description}
                </CardDescription>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Education Levels:</p>
                    <p className="text-sm text-muted-foreground">
                      {renderEducationLevels(school.education_levels)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Curriculum:</p>
                    <div className="flex flex-wrap gap-1">
                      {renderCurriculumTypes(school.curriculum_types).map((curriculum, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {curriculum}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={school.school_type === 'private' ? 'default' : 'secondary'}>
                      {school.school_type}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleSchoolClick(school);
                    }}>
                      <BookOpen className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && schools.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No schools found</CardTitle>
              <CardDescription>
                Try adjusting your search criteria or clearing the filters
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
