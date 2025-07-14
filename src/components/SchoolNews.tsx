
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  published_at: string;
  author_name?: string;
  slug: string;
}

interface SchoolNewsProps {
  schoolId: string;
}

export function SchoolNews({ schoolId }: SchoolNewsProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, [schoolId]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('school_news')
        .select('*')
        .eq('school_id', schoolId)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNews(data || []);
    } catch (error: any) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch school news.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No news articles available at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Latest News & Updates</h3>
      
      <div className="space-y-4">
        {news.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {article.published_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                      </div>
                    )}
                    {article.author_name && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{article.author_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-24 h-16 object-cover rounded ml-4"
                  />
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="mb-4">
                {article.excerpt || article.content.substring(0, 200) + '...'}
              </CardDescription>
              
              {expandedArticle === article.id && (
                <div className="prose prose-sm max-w-none mb-4">
                  <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
                </div>
              )}
              
              <button
                onClick={() => toggleExpanded(article.id)}
                className="text-primary hover:underline text-sm font-medium"
              >
                {expandedArticle === article.id ? 'Read less' : 'Read more'}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
