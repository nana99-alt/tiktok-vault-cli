import express, { Request, Response } from 'express';
import axios from 'axios';
import { TikTokScraper } from './services/scraper';

export function startWebServer(port: number = 3000): void {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TikTok Video Downloader - Premium & Elegant</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-gradient: radial-gradient(circle at 10% 20%, rgb(18, 18, 24) 0%, rgb(10, 10, 12) 90.2%);
      --card-bg: rgba(255, 255, 255, 0.05);
      --border-color: rgba(255, 255, 255, 0.1);
      --accent-gradient: linear-gradient(135deg, #FF0050 0%, #00F2FE 100%);
      --text-main: #FFFFFF;
      --text-muted: #9CA3AF;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    body {
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      width: 100%;
      max-width: 680px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.08);
      color: #00F2FE;
      margin-bottom: 12px;
      border: 1px solid rgba(0, 242, 254, 0.2);
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 14px;
    }
    .input-box {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }
    input[type="url"] {
      flex: 1;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 14px 18px;
      font-size: 15px;
      color: white;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="url"]:focus {
      border-color: #00F2FE;
    }
    button.action-btn {
      background: var(--accent-gradient);
      border: none;
      color: white;
      font-weight: 600;
      padding: 0 24px;
      border-radius: 14px;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
    }
    button.action-btn:hover { opacity: 0.9; }
    button.action-btn:active { transform: scale(0.98); }
    .result-container {
      display: none;
      margin-top: 28px;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
    }
    .video-card {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .video-card img {
      width: 110px;
      height: 140px;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }
    .video-details {
      flex: 1;
    }
    .video-details h3 {
      font-size: 16px;
      margin-bottom: 6px;
      line-height: 1.4;
    }
    .creator-tag {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    .download-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .download-actions a {
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 10px;
      transition: background 0.2s;
    }
    .btn-download-primary {
      background: #00F2FE;
      color: #0b0c10;
    }
    .btn-download-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
      border: 1px solid var(--border-color);
    }
    .spinner {
      display: none;
      text-align: center;
      padding: 20px;
      color: #00F2FE;
      font-size: 14px;
    }
    .error-box {
      display: none;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #FCA5A5;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">TikVault Engine</span>
      <h1>TikTok Video Downloader</h1>
      <p class="subtitle">Unduh video resolusi penuh tanpa watermark dengan antarmuka cepat dan bersih</p>
    </div>

    <div class="input-box">
      <input type="url" id="videoUrl" placeholder="Tempel tautan video TikTok di sini..." required />
      <button class="action-btn" id="fetchBtn">Unduh</button>
    </div>

    <div class="spinner" id="loader">Memproses dan mengekstrak media...</div>
    <div class="error-box" id="errorBox"></div>

    <div class="result-container" id="resultContainer">
      <div class="video-card">
        <img id="videoThumb" src="" alt="Thumbnail" />
        <div class="video-details">
          <h3 id="videoTitle">Judul Video</h3>
          <div class="creator-tag" id="videoCreator">@kreator</div>
          <div class="download-actions">
            <a id="dlStandard" href="#" target="_blank" class="btn-download-primary">Unduh Tanpa Watermark</a>
            <a id="dlHd" href="#" target="_blank" class="btn-download-secondary">Versi HD (Jika Ada)</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const fetchBtn = document.getElementById('fetchBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const loader = document.getElementById('loader');
    const errorBox = document.getElementById('errorBox');
    const resultContainer = document.getElementById('resultContainer');

    fetchBtn.addEventListener('click', async () => {
      const url = videoUrlInput.value.trim();
      if (!url) return;

      errorBox.style.display = 'none';
      resultContainer.style.display = 'none';
      loader.style.display = 'block';
      fetchBtn.disabled = true;

      try {
        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        const res = await response.json();

        if (!res.success) {
          throw new Error(res.error || 'Gagal memproses tautan.');
        }

        const meta = res.data;
        document.getElementById('videoTitle').textContent = meta.title || 'Video TikTok';
        document.getElementById('videoCreator').textContent = '@' + meta.author;
        document.getElementById('videoThumb').src = meta.coverUrl;
        
        const dlStd = document.getElementById('dlStandard');
        dlStd.href = meta.videoUrl;
        dlStd.setAttribute('download', 'tiktok_video.mp4');

        const dlHd = document.getElementById('dlHd');
        if (meta.videoUrlHd) {
          dlHd.href = meta.videoUrlHd;
          dlHd.style.display = 'inline-block';
        } else {
          dlHd.style.display = 'none';
        }

        resultContainer.style.display = 'block';
      } catch (err) {
        errorBox.textContent = err.message;
        errorBox.style.display = 'block';
      } finally {
        loader.style.display = 'none';
        fetchBtn.disabled = false;
      }
    });
  </script>
</body>
</html>`;

  app.get('/', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlContent);
  });

  app.post('/api/extract', async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Parameter url diperlukan.' });
    }
    const result = await TikTokScraper.extractVideo(url);
    return res.json(result);
  });

  app.listen(port, () => {
    console.log(`Server web aktif di: http://localhost:${port}`);
  });
}