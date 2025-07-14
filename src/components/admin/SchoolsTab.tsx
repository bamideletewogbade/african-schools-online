
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface School {
  id: string;
  name: string;
  slug: string;
  city: string;
  school_type: string;
  education_levels: string[];
  curriculum_types: string[];
  verified: boolean;
  featured: boolean;
  description?: string;
  region_id?: string;
}

interface Region {
  id: string;
  name: string;
}

export function SchoolsTab() {
  const [schools, setSchools] = useState<School[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    city: '',
    region_id: '',
    school_type: 'public',
    education_levels: [] as string[],
    curriculum_types: [] as string[]
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools();
    fetchRegions();
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

  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');

      if (error) throw error;
      setRegions(data || []);
    } catch (error: any) {
      console.error('Error fetching regions:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleAddSchool = async () => {
    try {
      const schoolData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
        verified: false,
        featured: false,
        rating: 0,
        total_reviews: 0
      };

      const { error } = await supabase
        .from('schools')
        .insert([schoolData]);

      if (error) throw error;

      toast({
        title: "School added",
        description: "School has been added successfully"
      });

      setShowAddDialog(false);
      resetForm();
      fetchSchools();
    } catch (error: any) {
      toast({
        title: "Error adding school",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditSchool = async () => {
    if (!editingSchool) return;

    try {
      const { error } = await supabase
        .from('schools')
        .update(formData)
        .eq('id', editingSchool.id);

      if (error) throw error;

      toast({
        title: "School updated",
        description: "School has been updated successfully"
      });

      setEditingSchool(null);
      resetForm();
      fetchSchools();
    } catch (error: any) {
      toast({
        title: "Error updating school",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!confirm('Are you sure you want to delete this school?')) return;

    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', schoolId);

      if (error) throw error;

      toast({
        title: "School deleted",
        description: "School has been deleted successfully"
      });

      fetchSchools();
    } catch (error: any) {
      toast({
        title: "Error deleting school",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      city: '',
      region_id: '',
      school_type: 'public',
      education_levels: [],
      curriculum_types: []
    });
  };

  const startEdit = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      slug: school.slug,
      description: school.description || '',
      city: school.city,
      region_id: school.region_id || '',
      school_type: school.school_type,
      education_levels: school.education_levels,
      curriculum_types: school.curriculum_types
    });
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
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New School</DialogTitle>
              <DialogDescription>
                Create a new school entry in the database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">School Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="URL-friendly name"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="School description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Region</label>
                  <Select value={formData.region_id} onValueChange={(value) => setFormData({ ...formData, region_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">School Type</label>
                <Select value={formData.school_type} onValueChange={(value) => setFormData({ ...formData, school_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSchool}>
                Add School
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/school/${school.slug}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEdit(school)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteSchool(school.id)}
                  >
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

      {/* Edit Dialog */}
      <Dialog open={!!editingSchool} onOpenChange={() => setEditingSchool(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>
              Update school information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">School Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">School Type</label>
                <Select value={formData.school_type} onValueChange={(value) => setFormData({ ...formData, school_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSchool(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSchool}>
              Update School
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
