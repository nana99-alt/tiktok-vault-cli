import axios from 'axios';
import { ScraperResult, VideoMetadata } from '../types';

export class TikTokScraper {
  private static readonly API_ENDPOINT = 'https://www.tikwm.com/api/';

  public static isValidTikTokUrl(url: string): boolean {
    const regex = /https?:\/\/(?:(?:vt|vm|www)\.tiktok\.com\/[^\s]+|(?:www\.)?tiktok\.com\/@[^\s]+\/video\/\d+)/i;
    return regex.test(url);
  }

  public static async extractVideo(url: string): Promise<ScraperResult> {
    try {
      if (!this.isValidTikTokUrl(url)) {
        return {
          success: false,
          error: 'Format URL TikTok tidak valid. Gunakan tautan video TikTok yang sah.'
        };
      }

      const response = await axios.post(
        this.API_ENDPOINT,
        new URLSearchParams({ url, hd: '1' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          },
          timeout: 10000
        }
      );

      if (response.data && response.data.code === 0 && response.data.data) {
        const data = response.data.data;
        const metadata: VideoMetadata = {
          title: data.title || 'TikTok Video',
          author: data.author?.nickname || data.author?.unique_id || 'Unknown',
          authorAvatar: data.author?.avatar,
          coverUrl: data.cover,
          videoUrl: data.play || data.play_url,
          videoUrlHd: data.hdplay,
          musicTitle: data.music_info?.title,
          stats: {
            views: data.play_count,
            likes: data.digg_count,
            comments: data.comment_count
          }
        };

        return {
          success: true,
          data: metadata
        };
      }

      return {
        success: false,
        error: response.data?.msg || 'Gagal mengekstrak video TikTok.'
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kesalahan jaringan atau server';
      return {
        success: false,
        error: `Gagal memproses URL: ${message}`
      };
    }
  }
}