export interface VideoMetadata {
  title: string;
  author: string;
  authorAvatar?: string;
  coverUrl: string;
  videoUrl: string;
  videoUrlHd?: string;
  musicTitle?: string;
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
}

export interface ScraperResult {
  success: boolean;
  data?: VideoMetadata;
  error?: string;
}