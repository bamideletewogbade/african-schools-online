-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('student', 'graduate', 'admin');

-- Create education levels enum  
CREATE TYPE public.education_level AS ENUM ('creche', 'primary', 'jhs', 'shs', 'tertiary');

-- Create curriculum types enum
CREATE TYPE public.curriculum_type AS ENUM ('ghanaian', 'british', 'american', 'ib', 'french', 'other');

-- Create school types enum
CREATE TYPE public.school_type AS ENUM ('public', 'private');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'student',
  current_education_level education_level,
  career_interests TEXT[],
  preferred_location TEXT,
  preferred_country TEXT DEFAULT 'Ghana',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create regions table for Ghana
CREATE TABLE public.regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  school_type school_type NOT NULL,
  education_levels education_level[] NOT NULL,
  curriculum_types curriculum_type[] NOT NULL,
  region_id UUID REFERENCES public.regions(id),
  city TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  established_year INTEGER,
  student_population INTEGER,
  teacher_student_ratio TEXT,
  facilities TEXT[],
  extracurricular_activities TEXT[],
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  requirements TEXT[],
  career_prospects TEXT[],
  education_level education_level NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create school courses junction table
CREATE TABLE public.school_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  fees_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, course_id)
);

-- Create school reviews table
CREATE TABLE public.school_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, user_id)
);

-- Create mentorship requests table
CREATE TABLE public.mentorship_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mentorship', 'study_abroad', 'career_guidance')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert Ghana regions
INSERT INTO public.regions (name, code) VALUES
('Greater Accra', 'GAR'),
('Ashanti', 'AH'),
('Western', 'WR'),
('Central', 'CR'),
('Volta', 'VR'),
('Eastern', 'ER'),
('Northern', 'NR'),
('Upper East', 'UER'),
('Upper West', 'UWR'),
('Brong Ahafo', 'BAR'),
('Western North', 'WNR'),
('Ahafo', 'AF'),
('Bono East', 'BER'),
('Oti', 'OT'),
('North East', 'NER'),
('Savannah', 'SV');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

-- Create security definer function for user role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for schools (public read, admin write)
CREATE POLICY "Anyone can view schools" ON public.schools
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage schools" ON public.schools
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for courses (public read, admin write)
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for school_courses (public read, admin write)
CREATE POLICY "Anyone can view school courses" ON public.school_courses
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage school courses" ON public.school_courses
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for reviews (users can CRUD their own, public read)
CREATE POLICY "Anyone can view reviews" ON public.school_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reviews" ON public.school_reviews
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for mentorship requests
CREATE POLICY "Users can view their own requests" ON public.mentorship_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests" ON public.mentorship_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" ON public.mentorship_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" ON public.mentorship_requests
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all requests" ON public.mentorship_requests
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for regions (public read)
CREATE POLICY "Anyone can view regions" ON public.regions
  FOR SELECT USING (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_reviews_updated_at
  BEFORE UPDATE ON public.school_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_requests_updated_at
  BEFORE UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();