export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          career_prospects: string[] | null
          created_at: string
          description: string | null
          duration: string | null
          education_level: Database["public"]["Enums"]["education_level"]
          id: string
          name: string
          requirements: string[] | null
          updated_at: string
        }
        Insert: {
          career_prospects?: string[] | null
          created_at?: string
          description?: string | null
          duration?: string | null
          education_level: Database["public"]["Enums"]["education_level"]
          id?: string
          name: string
          requirements?: string[] | null
          updated_at?: string
        }
        Update: {
          career_prospects?: string[] | null
          created_at?: string
          description?: string | null
          duration?: string | null
          education_level?: Database["public"]["Enums"]["education_level"]
          id?: string
          name?: string
          requirements?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      mentorship_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          career_interests: string[] | null
          created_at: string
          current_education_level:
            | Database["public"]["Enums"]["education_level"]
            | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean
          preferred_country: string | null
          preferred_location: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          career_interests?: string[] | null
          created_at?: string
          current_education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean
          preferred_country?: string | null
          preferred_location?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          career_interests?: string[] | null
          created_at?: string
          current_education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean
          preferred_country?: string | null
          preferred_location?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      school_courses: {
        Row: {
          course_id: string
          created_at: string
          fees_range: string | null
          id: string
          school_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          fees_range?: string | null
          id?: string
          school_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          fees_range?: string | null
          id?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_courses_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_news: {
        Row: {
          author_name: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean
          published_at: string | null
          school_id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string | null
          school_id: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string | null
          school_id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_news_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          school_id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          school_id: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          school_id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_reviews_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          city: string | null
          cover_image_url: string | null
          created_at: string
          curriculum_types: Database["public"]["Enums"]["curriculum_type"][]
          description: string | null
          education_levels: Database["public"]["Enums"]["education_level"][]
          email: string | null
          established_year: number | null
          extracurricular_activities: string[] | null
          facilities: string[] | null
          featured: boolean | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          rating: number | null
          region_id: string | null
          school_type: Database["public"]["Enums"]["school_type"]
          slug: string
          student_population: number | null
          teacher_student_ratio: string | null
          total_reviews: number | null
          updated_at: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string
          curriculum_types: Database["public"]["Enums"]["curriculum_type"][]
          description?: string | null
          education_levels: Database["public"]["Enums"]["education_level"][]
          email?: string | null
          established_year?: number | null
          extracurricular_activities?: string[] | null
          facilities?: string[] | null
          featured?: boolean | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          region_id?: string | null
          school_type: Database["public"]["Enums"]["school_type"]
          slug: string
          student_population?: number | null
          teacher_student_ratio?: string | null
          total_reviews?: number | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string
          curriculum_types?: Database["public"]["Enums"]["curriculum_type"][]
          description?: string | null
          education_levels?: Database["public"]["Enums"]["education_level"][]
          email?: string | null
          established_year?: number | null
          extracurricular_activities?: string[] | null
          facilities?: string[] | null
          featured?: boolean | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          region_id?: string | null
          school_type?: Database["public"]["Enums"]["school_type"]
          slug?: string
          student_population?: number | null
          teacher_student_ratio?: string | null
          total_reviews?: number | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      curriculum_type:
        | "ghanaian"
        | "british"
        | "american"
        | "ib"
        | "french"
        | "other"
      education_level: "creche" | "primary" | "jhs" | "shs" | "tertiary"
      school_type: "public" | "private"
      user_role: "student" | "graduate" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      curriculum_type: [
        "ghanaian",
        "british",
        "american",
        "ib",
        "french",
        "other",
      ],
      education_level: ["creche", "primary", "jhs", "shs", "tertiary"],
      school_type: ["public", "private"],
      user_role: ["student", "graduate", "admin"],
    },
  },
} as const
