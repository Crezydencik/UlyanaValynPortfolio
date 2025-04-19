export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      about: {
        Row: {
          created_at: string | null
          description: Json
          id: string
          image_url: string | null
          subtitle: Json
        }
        Insert: {
          created_at?: string | null
          description?: Json
          id?: string
          image_url?: string | null
          subtitle?: Json
        }
        Update: {
          created_at?: string | null
          description?: Json
          id?: string
          image_url?: string | null
          subtitle?: Json
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          title: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: Json | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string | null
          date: string
          description: Json | null
          id: string
          image_url: string | null
          issuer: Json
          title: Json
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: Json | null
          id?: string
          image_url?: string | null
          issuer?: Json
          title?: Json
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: Json | null
          id?: string
          image_url?: string | null
          issuer?: Json
          title?: Json
        }
        Relationships: []
      }
      contact: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          location: Json
          phone: string | null
          social_links: Json | null
          subtitle: Json | null
          title: Json | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          location?: Json
          phone?: string | null
          social_links?: Json | null
          subtitle?: Json | null
          title?: Json | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          location?: Json
          phone?: string | null
          social_links?: Json | null
          subtitle?: Json | null
          title?: Json | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          additional_images: string[] | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          short_description: string | null
          slug: string
          technologies: string[] | null
          title: string
          video_url: string | null
        }
        Insert: {
          additional_images?: string[] | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          short_description?: string | null
          slug: string
          technologies?: string[] | null
          title: string
          video_url?: string | null
        }
        Update: {
          additional_images?: string[] | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          short_description?: string | null
          slug?: string
          technologies?: string[] | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          icon: string | null
          id: string
          level: number | null
          name: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          level?: number | null
          name?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          level?: number | null
          name?: Json | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
