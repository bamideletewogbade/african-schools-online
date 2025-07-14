
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface NewsArticle {
  id: string;
  school_id: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  published: boolean;
  published_at?: string;
  author_name?: string;
  slug: string;
  schools?: {
    name: string;
  };
}

interface School {
  id: string;
  name: string;
}

export function NewsTab() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    school_id: '',
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    author_name: '',
    published: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
    fetchSchools();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('school_news')
        .select(`
          *,
          schools (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching news",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error: any) {
      console.error('Error fetching schools:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleAddNews = async () => {
    try {
      const newsData = {
        ...formData,
        slug: generateSlug(formData.title),
        published_at: formData.published ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('school_news')
        .insert(newsData);

      if (error) throw error;

      toast({
        title: "News article added",
        description: "News article has been added successfully"
      });

      setShowAddDialog(false);
      resetForm();
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error adding news",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditNews = async () => {
    if (!editingNews) return;

    try {
      const updateData = {
        ...formData,
        slug: generateSlug(formData.title),
        published_at: formData.published && !editingNews.published_at 
          ? new Date().toISOString() 
          : editingNews.published_at
      };

      const { error } = await supabase
        .from('school_news')
        .update(updateData)
        .eq('id', editingNews.id);

      if (error) throw error;

      toast({
        title: "News article updated",
        description: "News article has been updated successfully"
      });

      setEditingNews(null);
      resetForm();
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error updating news",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      const { error } = await supabase
        .from('school_news')
        .delete()
        .eq('id', newsId);

      if (error) throw error;

      toast({
        title: "News article deleted",
        description: "News article has been deleted successfully"
      });

      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error deleting news",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      school_id: '',
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      author_name: '',
      published: false
    });
  };

  const startEdit = (article: NewsArticle) => {
    setEditingNews(article);
    setFormData({
      school_id: article.school_id,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      image_url: article.image_url || '',
      author_name: article.author_name || '',
      published: article.published
    });
  };

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.schools?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = !selectedSchool || article.school_id === selectedSchool;
    return matchesSearch && matchesSchool;
  });

  if (loading) {
    return <div className="text-center p-8">Loading news...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by school" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All schools</SelectItem>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add News Article</DialogTitle>
              <DialogDescription>
                Create a new news article for a school.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">School</label>
                <Select value={formData.school_id} onValueChange={(value) => setFormData({ ...formData, school_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Article title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Author</label>
                  <Input
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the article"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article content"
                  rows={6}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <label className="text-sm font-medium">Publish immediately</label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNews}>
                Add Article
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredNews.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {article.title}
                    {article.published ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {article.schools?.name} • {article.author_name}
                    {article.published_at && (
                      <span className="ml-2 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEdit(article)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteNews(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.excerpt || article.content.substring(0, 150) + '...'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit News Article</DialogTitle>
            <DialogDescription>
              Update the news article information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">School</label>
              <Select value={formData.school_id} onValueChange={(value) => setFormData({ ...formData, school_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <label className="text-sm font-medium">Published</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNews(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditNews}>
              Update Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
