
export interface Project {
  id: string;
  title: string;
  description: Record<string, string>;
  short_description: Record<string, string>;
  image_url: string | null;
  video_url: string | null;
  technologies: string[];
  created_at: string;
  slug: string;
}
