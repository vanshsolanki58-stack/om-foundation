export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      meal_days: {
        Row: {
          created_at: string
          id: string
          meals_served: number
          notes: string | null
          served_on: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meals_served?: number
          notes?: string | null
          served_on: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meals_served?: number
          notes?: string | null
          served_on?: string
          updated_at?: string
        }
        Relationships: []
      }
      meal_photos: {
        Row: {
          ai_is_original: boolean | null
          ai_meal_being_served: boolean | null
          ai_reason: string | null
          caption: string | null
          counted_recipients: number
          counts_toward_meals: boolean
          created_at: string
          day_id: string
          drive_file_id: string | null
          drive_link: string | null
          id: string
          image_path: string
          updated_at: string
        }
        Insert: {
          ai_is_original?: boolean | null
          ai_meal_being_served?: boolean | null
          ai_reason?: string | null
          caption?: string | null
          counted_recipients?: number
          counts_toward_meals?: boolean
          created_at?: string
          day_id: string
          drive_file_id?: string | null
          drive_link?: string | null
          id?: string
          image_path: string
          updated_at?: string
        }
        Update: {
          ai_is_original?: boolean | null
          ai_meal_being_served?: boolean | null
          ai_reason?: string | null
          caption?: string | null
          counted_recipients?: number
          counts_toward_meals?: boolean
          created_at?: string
          day_id?: string
          drive_file_id?: string | null
          drive_link?: string | null
          id?: string
          image_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_photos_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "meal_days"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_recipients: {
        Row: {
          created_at: string
          description: string | null
          first_photo_id: string | null
          first_served_on: string | null
          id: string
          signature: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          first_photo_id?: string | null
          first_served_on?: string | null
          id?: string
          signature: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          first_photo_id?: string | null
          first_served_on?: string | null
          id?: string
          signature?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_recipients_first_photo_id_fkey"
            columns: ["first_photo_id"]
            isOneToOne: false
            referencedRelation: "meal_photos"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_submissions: {
        Row: {
          created_at: string
          email: string | null
          id: string
          interest: string | null
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          interest?: string | null
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          interest?: string | null
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
