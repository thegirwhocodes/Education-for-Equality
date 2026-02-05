export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      grades: {
        Row: {
          id: string
          number: number
          name: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          number: number
          name: string
          description?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          number?: number
          name?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index?: number
          created_at?: string
        }
      }
      units: {
        Row: {
          id: string
          grade_id: string
          subject_id: string
          title: string
          description: string | null
          order_index: number
          standards_alignment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          grade_id: string
          subject_id: string
          title: string
          description?: string | null
          order_index: number
          standards_alignment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          grade_id?: string
          subject_id?: string
          title?: string
          description?: string | null
          order_index?: number
          standards_alignment?: string | null
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          unit_id: string
          title: string
          description: string | null
          content: string | null
          video_url: string | null
          video_source: string | null
          external_link: string | null
          duration_minutes: number | null
          order_index: number
          standards: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          title: string
          description?: string | null
          content?: string | null
          video_url?: string | null
          video_source?: string | null
          external_link?: string | null
          duration_minutes?: number | null
          order_index: number
          standards?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          title?: string
          description?: string | null
          content?: string | null
          video_url?: string | null
          video_source?: string | null
          external_link?: string | null
          duration_minutes?: number | null
          order_index?: number
          standards?: string[] | null
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed_at: string | null
          time_spent_seconds: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed_at?: string | null
          time_spent_seconds?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed_at?: string | null
          time_spent_seconds?: number | null
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          selected_grade_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          selected_grade_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          selected_grade_id?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Grade = Database['public']['Tables']['grades']['Row']
export type Subject = Database['public']['Tables']['subjects']['Row']
export type Unit = Database['public']['Tables']['units']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']

// Joined types for queries
export type UnitWithLessons = Unit & { lessons: Lesson[] }
export type SubjectWithUnits = Subject & { units: UnitWithLessons[] }
export type GradeWithSubjects = Grade & { subjects: SubjectWithUnits[] }