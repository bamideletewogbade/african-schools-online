
-- Insert sample regions
INSERT INTO public.regions (name, code) VALUES 
('Greater Accra', 'GA'),
('Ashanti', 'AS'),
('Western', 'WR'),
('Central', 'CR'),
('Eastern', 'ER'),
('Northern', 'NR'),
('Upper East', 'UE'),
('Upper West', 'UW'),
('Volta', 'VR'),
('Brong Ahafo', 'BA')
ON CONFLICT DO NOTHING;

-- Insert sample schools
INSERT INTO public.schools (
  name, 
  slug, 
  description, 
  school_type, 
  education_levels, 
  curriculum_types, 
  city, 
  region_id,
  rating,
  total_reviews,
  student_population,
  featured,
  verified
) VALUES 
(
  'Achimota School',
  'achimota-school',
  'A prestigious co-educational boarding school known for academic excellence and holistic education.',
  'public',
  ARRAY['jhs', 'shs']::education_level[],
  ARRAY['ghanaian']::curriculum_type[],
  'Accra',
  (SELECT id FROM regions WHERE code = 'GA' LIMIT 1),
  4.5,
  156,
  2800,
  true,
  true
),
(
  'Presbyterian Boys'' Secondary School',
  'presec-legon',
  'One of Ghana''s most prestigious boys'' secondary schools with a rich tradition of academic excellence.',
  'public',
  ARRAY['shs']::education_level[],
  ARRAY['ghanaian']::curriculum_type[],
  'Accra',
  (SELECT id FROM regions WHERE code = 'GA' LIMIT 1),
  4.7,
  203,
  1200,
  true,
  true
),
(
  'Lincoln Community School',
  'lincoln-community-school',
  'International school offering American curriculum with modern facilities and diverse student body.',
  'private',
  ARRAY['primary', 'jhs', 'shs']::education_level[],
  ARRAY['american', 'ib']::curriculum_type[],
  'Accra',
  (SELECT id FROM regions WHERE code = 'GA' LIMIT 1),
  4.3,
  89,
  800,
  true,
  true
),
(
  'Opoku Ware School',
  'opoku-ware-school',
  'Historic boys'' secondary school in Kumasi known for producing leaders and scholars.',
  'public',
  ARRAY['shs']::education_level[],
  ARRAY['ghanaian']::curriculum_type[],
  'Kumasi',
  (SELECT id FROM regions WHERE code = 'AS' LIMIT 1),
  4.4,
  178,
  1500,
  true,
  true
),
(
  'Ghana International School',
  'ghana-international-school',
  'Premier international school offering British curriculum with excellent facilities.',
  'private',
  ARRAY['creche', 'primary', 'jhs', 'shs']::education_level[],
  ARRAY['british', 'ib']::curriculum_type[],
  'Accra',
  (SELECT id FROM regions WHERE code = 'GA' LIMIT 1),
  4.6,
  134,
  1100,
  true,
  true
),
(
  'Wesley Girls'' High School',
  'wesley-girls-high-school',
  'Prestigious girls'' boarding school known for academic excellence and character development.',
  'public',
  ARRAY['shs']::education_level[],
  ARRAY['ghanaian']::curriculum_type[],
  'Cape Coast',
  (SELECT id FROM regions WHERE code = 'CR' LIMIT 1),
  4.8,
  245,
  1800,
  true,
  true
),
(
  'SOS Hermann Gmeiner International College',
  'sos-hermann-gmeiner',
  'International boarding school offering IB programme with focus on global citizenship.',
  'private',
  ARRAY['jhs', 'shs']::education_level[],
  ARRAY['ib']::curriculum_type[],
  'Tema',
  (SELECT id FROM regions WHERE code = 'GA' LIMIT 1),
  4.2,
  67,
  600,
  false,
  true
),
(
  'Holy Child School',
  'holy-child-school',
  'Catholic girls'' secondary school with strong academic tradition and moral values.',
  'private',
  ARRAY['shs']::education_level[],
  ARRAY['ghanaian']::curriculum_type[],
  'Cape Coast',
  (SELECT id FROM regions WHERE code = 'CR' LIMIT 1),
  4.4,
  123,
  900,
  false,
  true
);

-- Insert sample courses
INSERT INTO public.courses (name, education_level, description, duration, requirements, career_prospects) VALUES
('General Science', 'shs', 'Foundation science programme covering Biology, Chemistry, Physics and Mathematics', '3 years', ARRAY['Good grades in JHS Science and Mathematics'], ARRAY['Medicine', 'Engineering', 'Pharmacy', 'Laboratory Technology']),
('General Arts', 'shs', 'Liberal arts programme focusing on languages, literature, history and social studies', '3 years', ARRAY['Good grades in English and Social Studies'], ARRAY['Law', 'Journalism', 'Teaching', 'Public Administration']),
('Business Studies', 'shs', 'Commercial programme covering accounting, economics, and business management', '3 years', ARRAY['Good grades in Mathematics and English'], ARRAY['Banking', 'Accounting', 'Business Management', 'Economics']),
('Visual Arts', 'shs', 'Creative arts programme focusing on drawing, painting, sculpture and design', '3 years', ARRAY['Portfolio submission', 'Good grades in Art'], ARRAY['Graphic Design', 'Fine Arts', 'Architecture', 'Fashion Design']),
('Agricultural Science', 'shs', 'Agricultural programme covering crop production, animal husbandry and agribusiness', '3 years', ARRAY['Interest in agriculture', 'Good grades in Science'], ARRAY['Agricultural Extension', 'Veterinary Medicine', 'Agribusiness', 'Food Technology']),
('Home Economics', 'shs', 'Programme covering nutrition, textiles, child development and family studies', '3 years', ARRAY['Interest in home management'], ARRAY['Hospitality Management', 'Nutrition', 'Fashion Design', 'Early Childhood Education']),
('Technical Skills', 'shs', 'Technical education covering woodwork, metalwork, electronics and building construction', '3 years', ARRAY['Good grades in Mathematics and Science'], ARRAY['Engineering', 'Architecture', 'Building Technology', 'Electronics']),
('Primary Education Programme', 'primary', 'Foundation education covering literacy, numeracy and basic subjects', '6 years', ARRAY['Age 6-12 years'], ARRAY['Junior High School']),
('Junior High School Programme', 'jhs', 'Lower secondary education preparing students for senior high school', '3 years', ARRAY['Completion of Primary School'], ARRAY['Senior High School', 'Technical/Vocational Training']);

-- Link some schools to courses
INSERT INTO public.school_courses (school_id, course_id, fees_range) VALUES
-- Achimota School courses
((SELECT id FROM schools WHERE slug = 'achimota-school'), (SELECT id FROM courses WHERE name = 'General Science'), 'GHS 2,000 - 4,000'),
((SELECT id FROM schools WHERE slug = 'achimota-school'), (SELECT id FROM courses WHERE name = 'General Arts'), 'GHS 2,000 - 4,000'),
((SELECT id FROM schools WHERE slug = 'achimota-school'), (SELECT id FROM courses WHERE name = 'Business Studies'), 'GHS 2,000 - 4,000'),
-- Presbyterian Boys' Secondary School courses  
((SELECT id FROM schools WHERE slug = 'presec-legon'), (SELECT id FROM courses WHERE name = 'General Science'), 'GHS 1,800 - 3,500'),
((SELECT id FROM schools WHERE slug = 'presec-legon'), (SELECT id FROM courses WHERE name = 'General Arts'), 'GHS 1,800 - 3,500'),
-- Lincoln Community School courses
((SELECT id FROM schools WHERE slug = 'lincoln-community-school'), (SELECT id FROM courses WHERE name = 'Primary Education Programme'), 'USD 8,000 - 12,000'),
((SELECT id FROM schools WHERE slug = 'lincoln-community-school'), (SELECT id FROM courses WHERE name = 'Junior High School Programme'), 'USD 9,000 - 13,000'),
((SELECT id FROM schools WHERE slug = 'lincoln-community-school'), (SELECT id FROM courses WHERE name = 'General Science'), 'USD 10,000 - 15,000'),
-- Ghana International School courses
((SELECT id FROM schools WHERE slug = 'ghana-international-school'), (SELECT id FROM courses WHERE name = 'Primary Education Programme'), 'USD 7,500 - 11,000'),
((SELECT id FROM schools WHERE slug = 'ghana-international-school'), (SELECT id FROM courses WHERE name = 'Junior High School Programme'), 'USD 8,500 - 12,000'),
((SELECT id FROM schools WHERE slug = 'ghana-international-school'), (SELECT id FROM courses WHERE name = 'General Science'), 'USD 9,500 - 14,000');
