
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface School {
  id: string;
  name: string;
  city: string;
  school_type: string;
  education_levels: string[];
  curriculum_types: string[];
  verified: boolean;
  featured: boolean;
}

export function SchoolsTab() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching schools",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVerified = async (schoolId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ verified: !currentStatus })
        .eq('id', schoolId);

      if (error) throw error;

      setSchools(schools.map(school => 
        school.id === schoolId 
          ? { ...school, verified: !currentStatus }
          : school
      ));

      toast({
        title: "School updated",
        description: `School ${!currentStatus ? 'verified' : 'unverified'} successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error updating school",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (schoolId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ featured: !currentStatus })
        .eq('id', schoolId);

      if (error) throw error;

      setSchools(schools.map(school => 
        school.id === schoolId 
          ? { ...school, featured: !currentStatus }
          : school
      ));

      toast({
        title: "School updated",
        description: `School ${!currentStatus ? 'featured' : 'unfeatured'} successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error updating school",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center p-8">Loading schools...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredSchools.map((school) => (
          <Card key={school.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {school.name}
                    {school.verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                    {school.featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {school.city} • {school.school_type}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {school.education_levels?.map((level) => (
                  <Badge key={level} variant="outline">{level}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={school.verified ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleVerified(school.id, school.verified)}
                >
                  {school.verified ? 'Verified' : 'Verify'}
                </Button>
                <Button
                  variant={school.featured ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeatured(school.id, school.featured)}
                >
                  {school.featured ? 'Featured' : 'Feature'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
