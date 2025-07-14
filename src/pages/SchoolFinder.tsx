import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Star, Users, BookOpen, Calendar } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
            Find Your Perfect School
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and compare educational institutions across Ghana, from creche to tertiary level
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-card bg-card/95 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
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
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="bg-background/50">
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
                <SelectTrigger className="bg-background/50">
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
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="School Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                <SelectTrigger className="bg-background/50">
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
              className="group hover:scale-[1.02] cursor-pointer shadow-card hover:shadow-soft transition-all duration-300 bg-card/95 backdrop-blur-sm border border-border/50 overflow-hidden"
              onClick={() => handleSchoolClick(school)}
            >
              {/* School Image */}
              <div className="relative h-48 overflow-hidden">
                {school.cover_image_url ? (
                  <img
                    src={school.cover_image_url}
                    alt={`${school.name} campus`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-card flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
                
                {/* Badges overlay */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {school.featured && (
                    <Badge className="bg-primary text-primary-foreground shadow-sm">
                      Featured
                    </Badge>
                  )}
                  {school.verified && (
                    <Badge variant="secondary" className="shadow-sm">
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Logo overlay */}
                {school.logo_url && (
                  <div className="absolute bottom-2 left-2">
                    <img
                      src={school.logo_url}
                      alt={`${school.name} logo`}
                      className="w-12 h-12 object-contain rounded-lg bg-white/90 p-1 shadow-sm"
                    />
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg mb-2 line-clamp-1">{school.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-1">{school.city}, {school.regions?.name}</span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{school.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({school.total_reviews})</span>
                  </div>
                  {school.student_population && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{school.student_population}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <CardDescription className="mb-4 line-clamp-2 text-sm">
                  {school.description}
                </CardDescription>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium mb-1 text-foreground">Education Levels:</p>
                    <p className="text-xs text-muted-foreground">
                      {renderEducationLevels(school.education_levels)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-1 text-foreground">Curriculum:</p>
                    <div className="flex flex-wrap gap-1">
                      {renderCurriculumTypes(school.curriculum_types).map((curriculum, index) => (
                        <Badge key={index} variant="outline" className="text-xs py-0">
                          {curriculum}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <Badge variant={school.school_type === 'private' ? 'default' : 'secondary'} className="text-xs">
                      {school.school_type}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={(e) => {
                      e.stopPropagation();
                      handleSchoolClick(school);
                    }}>
                      <BookOpen className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && schools.length === 0 && (
          <Card className="text-center py-12 bg-card/95 backdrop-blur-sm">
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
