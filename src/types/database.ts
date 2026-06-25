export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          theme?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          theme?: string
          updated_at?: string
        }
      }
      thoughts: {
        Row: {
          id: string
          user_id: string
          content: string
          status: string
          converted_to_type: string | null
          converted_to_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          status?: string
          converted_to_type?: string | null
          converted_to_id?: string | null
        }
        Update: {
          content?: string
          status?: string
          converted_to_type?: string | null
          converted_to_id?: string | null
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: string
          energy: string
          batch_type: string | null
          due_date: string | null
          due_time: string | null
          completed_at: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: string
          energy?: string
          batch_type?: string | null
          due_date?: string | null
          due_time?: string | null
          sort_order?: number
        }
        Update: {
          title?: string
          description?: string | null
          status?: string
          energy?: string
          batch_type?: string | null
          due_date?: string | null
          due_time?: string | null
          completed_at?: string | null
          sort_order?: number
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_at: string
          end_at: string | null
          all_day: boolean
          location: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_at: string
          end_at?: string | null
          all_day?: boolean
          location?: string | null
          color?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          start_at?: string
          end_at?: string | null
          all_day?: boolean
          location?: string | null
          color?: string | null
          updated_at?: string
        }
      }
      birthdays: {
        Row: {
          id: string
          user_id: string
          name: string
          birth_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          birth_date: string
          notes?: string | null
        }
        Update: {
          name?: string
          birth_date?: string
          notes?: string | null
        }
      }
      folders: {
        Row: {
          id: string
          user_id: string
          parent_id: string | null
          name: string
          color: string | null
          icon: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          parent_id?: string | null
          name: string
          color?: string | null
          icon?: string | null
          sort_order?: number
        }
        Update: {
          parent_id?: string | null
          name?: string
          color?: string | null
          icon?: string | null
          sort_order?: number
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          folder_id: string | null
          title: string
          content: string | null
          tags: string[]
          pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          folder_id?: string | null
          title: string
          content?: string | null
          tags?: string[]
          pinned?: boolean
        }
        Update: {
          folder_id?: string | null
          title?: string
          content?: string | null
          tags?: string[]
          pinned?: boolean
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string
          folder_id: string | null
          note_id: string | null
          storage_path: string
          file_name: string
          mime_type: string | null
          file_size_bytes: number | null
          tags: string[]
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          folder_id?: string | null
          note_id?: string | null
          storage_path: string
          file_name: string
          mime_type?: string | null
          file_size_bytes?: number | null
          tags?: string[]
          description?: string | null
        }
        Update: {
          folder_id?: string | null
          note_id?: string | null
          file_name?: string
          mime_type?: string | null
          tags?: string[]
          description?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
