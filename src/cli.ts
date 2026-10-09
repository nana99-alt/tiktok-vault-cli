#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { TikTokScraper } from './services/scraper';
import { startWebServer } from './server';

const program = new Command();

program
  .name('tiktok-vault')
  .description('Utilitas CLI elegan untuk mengunduh video TikTok tanpa watermark')
  .version('1.0.0');

program
  .command('download <url>')
  .description('Unduh video TikTok tanpa watermark langsung ke direktori Anda')
  .option('-o, --output <path>', 'Lokasi atau nama berkas keluaran', '')
  .action(async (url: string, options: { output?: string }) => {
    console.log(chalk.cyan.bold('\n[TikVault] Mempersiapkan proses pengunduhan...'));
    const spinner = ora('Menghubungkan dan mengekstrak tautan media...').start();

    try {
      const result = await TikTokScraper.extractVideo(url);

      if (!result.success || !result.data) {
        spinner.fail(chalk.red(result.error || 'Gagal mengekstrak video.'));
        process.exit(1);
      }

      const meta = result.data;
      spinner.succeed(chalk.green('Informasi video berhasil didapatkan!'));

      console.log(chalk.gray('----------------------------------------------------'));
      console.log(`${chalk.bold('Judul    :')} ${meta.title}`);
      console.log(`${chalk.bold('Kreator  :')} @${meta.author}`);
      if (meta.stats?.likes) console.log(`${chalk.bold('Likes    :')} ${meta.stats.likes.toLocaleString()}`);
      console.log(chalk.gray('----------------------------------------------------'));

      const downloadUrl = meta.videoUrlHd || meta.videoUrl;
      const defaultFilename = `tiktok_${Date.now()}.mp4`;
      const targetFile = options.output ? options.output : path.join(process.cwd(), defaultFilename);

      const dlSpinner = ora(`Mengunduh file ke ${chalk.yellow(path.basename(targetFile))}...`).start();

      const response = await axios({
        url: downloadUrl,
        method: 'GET',
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(targetFile);
      response.data.pipe(writer);

      await new Promise<void>((resolve, reject) => {
        writer.on('finish', () => resolve());
        writer.on('error', (err) => reject(err));
      });

      dlSpinner.succeed(chalk.green(`Selesai! Video tersimpan di: ${chalk.bold(targetFile)}\n`));
    } catch (err: unknown) {
      spinner.fail(chalk.red('Terjadi kesalahan saat memproses unduhan.'));
      if (err instanceof Error) {
        console.error(chalk.red(err.message));
      }
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Jalankan antarmuka web interaktif lokal')
  .option('-p, --port <number>', 'Nomor port server', '3000')
  .action((options: { port: string }) => {
    const port = parseInt(options.port, 10) || 3000;
    console.log(chalk.cyan.bold(`\nMenjalankan Web UI di port ${port}...`));
    startWebServer(port);
  });

program.parse(process.argv);
