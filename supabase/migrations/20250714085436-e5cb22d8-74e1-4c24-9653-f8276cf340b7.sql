
-- Create school_news table
CREATE TABLE public.school_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  author_name VARCHAR(100),
  slug VARCHAR(255) NOT NULL
);

-- Create index for better query performance
CREATE INDEX idx_school_news_school_id ON public.school_news(school_id);
CREATE INDEX idx_school_news_published ON public.school_news(published);
CREATE INDEX idx_school_news_published_at ON public.school_news(published_at);

-- Create unique constraint for slug per school
CREATE UNIQUE INDEX idx_school_news_school_slug ON public.school_news(school_id, slug);

-- Enable Row Level Security
ALTER TABLE public.school_news ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view published news" 
  ON public.school_news 
  FOR SELECT 
  USING (published = true);

CREATE POLICY "Admins can manage all school news" 
  ON public.school_news 
  FOR ALL 
  USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create trigger for updated_at
CREATE TRIGGER update_school_news_updated_at
  BEFORE UPDATE ON public.school_news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
