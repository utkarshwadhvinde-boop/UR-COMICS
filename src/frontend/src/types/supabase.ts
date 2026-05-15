export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          handle: string | null;
          bio: string | null;
          avatar_url: string | null;
          is_creator: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      comics: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cover_url: string | null;
          author_id: string;
          is_published: boolean;
          view_count: number;
          metadata: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["comics"]["Row"],
          "id" | "created_at" | "updated_at" | "view_count"
        >;
        Update: Partial<Database["public"]["Tables"]["comics"]["Insert"]>;
      };
      chapters: {
        Row: {
          id: string;
          comic_id: string;
          chapter_number: number;
          title: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["chapters"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["chapters"]["Insert"]>;
      };
      chapter_pages: {
        Row: {
          id: string;
          chapter_id: string;
          page_number: number;
          image_url: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["chapter_pages"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["chapter_pages"]["Insert"]
        >;
      };
      genres: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["genres"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["genres"]["Insert"]>;
      };
      comic_genres: {
        Row: {
          comic_id: string;
          genre_id: string;
        };
        Insert: Database["public"]["Tables"]["comic_genres"]["Row"];
        Update: Partial<Database["public"]["Tables"]["comic_genres"]["Row"]>;
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          comic_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["likes"]["Row"],
          "id" | "created_at"
        >;
        Update: never;
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          comic_id: string;
          chapter_id: string | null;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["comments"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>;
      };
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["follows"]["Row"],
          "created_at"
        >;
        Update: never;
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          comic_id: string;
          last_chapter_id: string | null;
          last_page_number: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["bookmarks"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Insert"]>;
      };
    };
  };
}
