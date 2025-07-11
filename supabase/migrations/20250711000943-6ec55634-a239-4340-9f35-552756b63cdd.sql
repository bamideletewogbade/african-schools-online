-- Insert sample schools in Ghana
INSERT INTO public.schools (
  name, slug, description, logo_url, cover_image_url, rating, student_population, 
  established_year, region_id, city, address, phone, email, website, 
  curriculum_types, education_levels, teacher_student_ratio, facilities, 
  extracurricular_activities, school_type, featured, verified
) VALUES
-- Greater Accra Schools
('Achimota School', 'achimota-school', 'One of Ghana''s most prestigious secondary schools with a rich history of academic excellence.', NULL, NULL, 4.5, 3000, 1924, 
(SELECT id FROM regions WHERE code = 'GR'), 'Accra', 'Achimota, Accra', '+233-30-2777777', 'info@achimotaschool.edu.gh', 'www.achimotaschool.edu.gh',
ARRAY['ghanaian'], ARRAY['shs'], '1:20', ARRAY['Library', 'Science Labs', 'Sports Complex', 'Dormitories'], 
ARRAY['Football', 'Basketball', 'Drama', 'Debate'], 'public', true, true),

('Presbyterian Boys'' Secondary School (PRESEC)', 'presec-legon', 'A leading boys'' secondary school known for academic excellence and sports.', NULL, NULL, 4.7, 2500, 1938,
(SELECT id FROM regions WHERE code = 'GR'), 'Legon', 'University of Ghana, Legon', '+233-30-2501681', 'info@preseclegon.edu.gh', 'www.preseclegon.edu.gh',
ARRAY['ghanaian'], ARRAY['shs'], '1:18', ARRAY['Library', 'Science Labs', 'Computer Lab', 'Assembly Hall'], 
ARRAY['Quiz Competition', 'Football', 'Athletics'], 'public', true, true),

('Wesley Girls'' High School', 'wesley-girls', 'Premier girls'' secondary school with strong academic traditions.', NULL, NULL, 4.6, 2200, 1884,
(SELECT id FROM regions WHERE code = 'CR'), 'Cape Coast', 'Cape Coast', '+233-33-2132054', 'info@wesleygirls.edu.gh', 'www.wesleygirls.edu.gh',
ARRAY['ghanaian'], ARRAY['shs'], '1:19', ARRAY['Library', 'Science Labs', 'Art Studio', 'Music Room'], 
ARRAY['Netball', 'Volleyball', 'Choir', 'Drama'], 'public', true, true),

('Ghana International School', 'gis-accra', 'International school offering British and IB curricula.', NULL, NULL, 4.8, 800, 1955,
(SELECT id FROM regions WHERE code = 'GR'), 'Cantonments', 'Cantonments, Accra', '+233-30-2776171', 'admissions@gis.edu.gh', 'www.gis.edu.gh',
ARRAY['british', 'ib'], ARRAY['primary', 'jhs', 'shs'], '1:12', ARRAY['Modern Labs', 'Swimming Pool', 'Theater', 'Art Studios'], 
ARRAY['Swimming', 'Tennis', 'Model UN', 'Community Service'], 'private', true, true),

('Lincoln Community School', 'lincoln-accra', 'American international school serving expatriate and local communities.', NULL, NULL, 4.4, 600, 1968,
(SELECT id FROM regions WHERE code = 'GR'), 'Accra', 'Roman Ridge, Accra', '+233-30-2229570', 'info@lincoln.edu.gh', 'www.lincoln.edu.gh',
ARRAY['american'], ARRAY['primary', 'jhs', 'shs'], '1:15', ARRAY['Computer Labs', 'Gymnasium', 'Library', 'Cafeteria'], 
ARRAY['Basketball', 'Soccer', 'Drama Club', 'Student Council'], 'private', false, true),

-- Ashanti Region Schools
('Opoku Ware School', 'opoku-ware', 'Historic boys'' secondary school in Kumasi known for academic achievement.', NULL, NULL, 4.3, 2800, 1952,
(SELECT id FROM regions WHERE code = 'AS'), 'Kumasi', 'Santasi, Kumasi', '+233-32-2060123', 'info@owass.edu.gh', 'www.owass.edu.gh',
ARRAY['ghanaian'], ARRAY['shs'], '1:22', ARRAY['Library', 'Science Complex', 'Workshop', 'Assembly Hall'], 
ARRAY['Football', 'Table Tennis', 'Debate'], 'public', true, true),

('Prempeh College', 'prempeh-college', 'One of Ghana''s oldest and most prestigious secondary schools.', NULL, NULL, 4.6, 3200, 1949,
(SELECT id FROM regions WHERE code = 'AS'), 'Kumasi', 'Kumasi', '+233-32-2022846', 'info@prempehcollege.edu.gh', 'www.prempehcollege.edu.gh',
ARRAY['ghanaian'], ARRAY['shs'], '1:25', ARRAY['Library', 'Science Labs', 'ICT Lab', 'Sports Facilities'], 
ARRAY['Football', 'Athletics', 'Quiz', 'Drama'], 'public', true, true),

-- Northern Region Schools
('Tamale Senior High School', 'tamale-shs', 'Leading secondary school in Northern Ghana.', NULL, NULL, 4.1, 2000, 1951,
(SELECT id FROM regions WHERE code = 'NR'), 'Tamale', 'Tamale', '+233-37-2022456', 'info@tamaleshs.edu.gh', NULL,
ARRAY['ghanaian'], ARRAY['shs'], '1:28', ARRAY['Library', 'Science Block', 'Computer Lab'], 
ARRAY['Football', 'Volleyball', 'Cultural Dance'], 'public', false, true),

-- Volta Region Schools
('Mawuli School', 'mawuli-school', 'Co-educational secondary school with strong academic reputation.', NULL, NULL, 4.2, 1800, 1950,
(SELECT id FROM regions WHERE code = 'VR'), 'Ho', 'Ho', '+233-36-2028123', 'info@mawulischool.edu.gh', NULL,
ARRAY['ghanaian'], ARRAY['shs'], '1:24', ARRAY['Library', 'Labs', 'Assembly Hall'], 
ARRAY['Football', 'Basketball', 'Drama'], 'public', false, true),

-- Primary Schools
('Airport Residential Area School', 'airport-primary', 'Modern primary school in Airport Residential Area.', NULL, NULL, 4.0, 400, 1980,
(SELECT id FROM regions WHERE code = 'GR'), 'Accra', 'Airport Residential Area, Accra', '+233-30-2775432', 'info@airportschool.edu.gh', NULL,
ARRAY['ghanaian'], ARRAY['primary'], '1:25', ARRAY['Playground', 'Computer Lab', 'Library'], 
ARRAY['Football', 'Arts and Crafts'], 'private', false, false),

('Ridge Church School', 'ridge-church', 'Established church school with good academic standards.', NULL, NULL, 3.9, 350, 1965,
(SELECT id FROM regions WHERE code = 'GR'), 'Accra', 'Ridge, Accra', '+233-30-2667890', 'info@ridgechurch.edu.gh', NULL,
ARRAY['ghanaian'], ARRAY['primary', 'jhs'], '1:30', ARRAY['Chapel', 'Library', 'Playground'], 
ARRAY['Choir', 'Football'], 'private', false, false);

-- Insert sample courses
INSERT INTO public.courses (name, description, education_level, duration, requirements, career_prospects) VALUES
('General Science', 'Foundation science program covering Biology, Chemistry, Physics, and Mathematics', 'shs', '3 years', 
ARRAY['Credit in English Language', 'Credit in Mathematics', 'Credit in Science'], 
ARRAY['Medicine', 'Engineering', 'Pharmacy', 'Nursing']),

('General Arts', 'Liberal arts program focusing on languages, literature, and social sciences', 'shs', '3 years',
ARRAY['Credit in English Language', 'Credit in Social Studies'], 
ARRAY['Law', 'Teaching', 'Journalism', 'Social Work']),

('Business', 'Business studies program covering accounting, economics, and management', 'shs', '3 years',
ARRAY['Credit in English Language', 'Credit in Mathematics'], 
ARRAY['Banking', 'Accounting', 'Management', 'Marketing']),

('Visual Arts', 'Creative arts program covering fine arts, graphics, and design', 'shs', '3 years',
ARRAY['Credit in English Language', 'Portfolio submission'], 
ARRAY['Graphic Design', 'Fine Arts', 'Fashion Design', 'Architecture']),

('Home Economics', 'Practical life skills including nutrition, textiles, and child development', 'shs', '3 years',
ARRAY['Credit in English Language', 'Credit in Science'], 
ARRAY['Hospitality', 'Nutrition', 'Fashion Design', 'Teaching']),

('Technical/Vocational', 'Technical skills in various trades and vocations', 'shs', '3 years',
ARRAY['Credit in English Language', 'Credit in Mathematics'], 
ARRAY['Engineering', 'Construction', 'Automotive', 'ICT']),

-- Primary Level Courses
('Primary Education Foundation', 'Comprehensive primary education covering all basic subjects', 'primary', '6 years',
ARRAY['Age 6-12 years'], 
ARRAY['Secondary School', 'Technical Education']),

-- JHS Courses
('Junior High School Program', 'Comprehensive junior secondary education', 'jhs', '3 years',
ARRAY['Primary School Certificate'], 
ARRAY['Senior High School', 'Technical Institute']);

-- Link some schools to courses (sample data)
INSERT INTO public.school_courses (school_id, course_id, fees_range) VALUES
-- Achimota School courses
((SELECT id FROM schools WHERE slug = 'achimota-school'), 
 (SELECT id FROM courses WHERE name = 'General Science'), '₵2,000 - ₵3,000'),
((SELECT id FROM schools WHERE slug = 'achimota-school'), 
 (SELECT id FROM courses WHERE name = 'General Arts'), '₵2,000 - ₵3,000'),
((SELECT id FROM schools WHERE slug = 'achimota-school'), 
 (SELECT id FROM courses WHERE name = 'Business'), '₵2,000 - ₵3,000'),

-- PRESEC courses
((SELECT id FROM schools WHERE slug = 'presec-legon'), 
 (SELECT id FROM courses WHERE name = 'General Science'), '₵1,800 - ₵2,500'),
((SELECT id FROM schools WHERE slug = 'presec-legon'), 
 (SELECT id FROM courses WHERE name = 'General Arts'), '₵1,800 - ₵2,500'),

-- Wesley Girls courses
((SELECT id FROM schools WHERE slug = 'wesley-girls'), 
 (SELECT id FROM courses WHERE name = 'General Science'), '₵1,500 - ₵2,200'),
((SELECT id FROM schools WHERE slug = 'wesley-girls'), 
 (SELECT id FROM courses WHERE name = 'General Arts'), '₵1,500 - ₵2,200'),
((SELECT id FROM schools WHERE slug = 'wesley-girls'), 
 (SELECT id FROM courses WHERE name = 'Home Economics'), '₵1,500 - ₵2,200'),

-- Ghana International School
((SELECT id FROM schools WHERE slug = 'gis-accra'), 
 (SELECT id FROM courses WHERE name = 'Primary Education Foundation'), '₵8,000 - ₵12,000'),
((SELECT id FROM schools WHERE slug = 'gis-accra'), 
 (SELECT id FROM courses WHERE name = 'Junior High School Program'), '₵10,000 - ₵15,000'),
((SELECT id FROM schools WHERE slug = 'gis-accra'), 
 (SELECT id FROM courses WHERE name = 'General Science'), '₵12,000 - ₵18,000');