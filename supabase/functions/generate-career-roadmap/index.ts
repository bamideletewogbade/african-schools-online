
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { profileData, preferences } = await req.json();

    // Fetch available courses and schools
    const { data: courses } = await supabase
      .from('courses')
      .select('*');

    const { data: schools } = await supabase
      .from('schools')
      .select('*, regions(name)');

    const prompt = `
    As a career counselor and education expert, create a comprehensive career roadmap for a student with the following profile:

    Profile:
    - Current Education Level: ${profileData.current_education_level}
    - Career Interests: ${profileData.career_interests?.join(', ') || 'Not specified'}
    - Preferred Location: ${profileData.preferred_location}
    - Preferred Country: ${profileData.preferred_country}

    Additional Preferences:
    - Target Career: ${preferences.targetCareer || 'Not specified'}
    - Timeline: ${preferences.timeline || '5 years'}
    - Learning Style: ${preferences.learningStyle || 'Mixed'}

    Available Courses: ${JSON.stringify(courses?.slice(0, 10))}
    Available Schools: ${JSON.stringify(schools?.slice(0, 10))}

    Please provide a detailed JSON response with the following structure:
    {
      "careerRoadmap": {
        "title": "Career title/path",
        "overview": "Brief overview of the career path",
        "phases": [
          {
            "phase": "Phase name",
            "duration": "Time duration",
            "description": "What to focus on",
            "milestones": ["milestone 1", "milestone 2"],
            "recommendedCourses": ["course names"],
            "skills": ["skill 1", "skill 2"]
          }
        ]
      },
      "courseRecommendations": [
        {
          "courseName": "Course name",
          "reason": "Why this course",
          "priority": "high/medium/low",
          "timing": "When to take it"
        }
      ],
      "schoolRecommendations": [
        {
          "schoolName": "School name",
          "reason": "Why this school",
          "programs": ["relevant programs"]
        }
      ],
      "careerOutlook": {
        "jobMarket": "Job market analysis",
        "salaryRange": "Expected salary range",
        "growth": "Career growth potential"
      },
      "nextSteps": ["immediate action 1", "immediate action 2"]
    }

    Make the recommendations specific, actionable, and aligned with the student's location preferences and current education level.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${data.error?.message || 'Unknown error'}`);
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Parse the JSON response
    let roadmapData;
    try {
      // Extract JSON from the response (remove any markdown formatting)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      roadmapData = JSON.parse(jsonMatch ? jsonMatch[0] : generatedText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      // Fallback response if JSON parsing fails
      roadmapData = {
        careerRoadmap: {
          title: "Personalized Career Path",
          overview: "AI-generated career guidance based on your profile",
          phases: []
        },
        courseRecommendations: [],
        schoolRecommendations: [],
        careerOutlook: {
          jobMarket: "Analysis in progress",
          salaryRange: "Contact counselor for details",
          growth: "Promising opportunities ahead"
        },
        nextSteps: ["Complete your profile", "Explore recommended courses"]
      };
    }

    // Store the roadmap in the database
    const { error: insertError } = await supabase
      .from('mentorship_requests')
      .insert({
        user_id: user.id,
        type: 'career_roadmap',
        subject: 'AI Generated Career Roadmap',
        message: JSON.stringify(roadmapData),
        status: 'completed'
      });

    if (insertError) {
      console.error('Error storing roadmap:', insertError);
    }

    return new Response(JSON.stringify(roadmapData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-career-roadmap function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
