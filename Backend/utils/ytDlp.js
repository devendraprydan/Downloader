const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Find the yt-dlp executable path.
 * Checks environment variable first, then common locations.
 */
function findYtDlpPath() {
  if (process.env.YT_DLP_PATH) {
    const envPath = process.env.YT_DLP_PATH;
    if (fs.existsSync(envPath)) return envPath;
  }

  const possiblePaths = [
    'yt-dlp',
    '/usr/local/bin/yt-dlp',
    '/usr/bin/yt-dlp',
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'yt-dlp', 'yt-dlp.exe'),
    path.join(process.env.APPDATA || '', 'yt-dlp', 'yt-dlp.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Python', 'Python312', 'Scripts', 'yt-dlp.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Python', 'Python311', 'Scripts', 'yt-dlp.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Python', 'Python310', 'Scripts', 'yt-dlp.exe'),
    path.join(process.env.APPDATA || '', 'Python', 'Scripts', 'yt-dlp.exe'),
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      continue;
    }
  }

  try {
    const which = process.platform === 'win32' ? 'where' : 'which';
    return execSync(`${which} yt-dlp`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/**
 * Build base yt-dlp arguments for safe filenames and bot-detection bypass.
 *
 * YouTube bot detection bypass strategy (no cookies needed):
 * - --extractor-args "youtube:player_client=web_creator,android"
 *   Uses alternative YouTube API clients that are less aggressively
 *   rate-limited than the default 'web' client.
 * - Realistic user-agent to avoid bot fingerprinting.
 */
function buildBaseArgs() {
  return [
    '--no-warnings',
    '--restrict-filenames',
    '--windows-filenames',
    // Bypass YouTube bot detection using alternative player clients
    // web_creator: used by YouTube Studio, less restricted
    // android: mobile API, different rate limits
    '--extractor-args', 'youtube:player_client=web_creator,android',
    '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  ];
}

/**
 * Run yt-dlp with args, with automatic fallback on failure.
 * Tries with --extractor-args first, then without if it fails.
 */
function runYtDlp(ytDlpPath, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ytDlpPath, args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => { stdout += data.toString(); });
    proc.stderr.on('data', (data) => { stderr += data.toString(); });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || `yt-dlp exited with code ${code}`));
      }
      resolve({ stdout, stderr });
    });

    proc.on('error', (err) => {
      reject(new Error('Failed to start yt-dlp: ' + err.message));
    });

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error('Request timed out'));
    }, timeoutMs);

    proc.on('close', () => clearTimeout(timer));
  });
}

/**
 * Get video info using yt-dlp with automatic fallback.
 */
async function getVideoInfo(url, ytDlpPath) {
  const baseArgs = [
    ...buildBaseArgs(),
    '--dump-json',
    '--no-download',
    url,
  ];

  // Attempt 1: with extractor-args (bypass bot detection)
  try {
    const { stdout } = await runYtDlp(ytDlpPath, baseArgs, 45000);
    return JSON.parse(stdout);
  } catch (err) {
    // If it looks like a player_client issue, try without
    if (err.message.includes('player_client') || err.message.includes('extractor')) {
      const fallbackArgs = [
        '--no-warnings',
        '--restrict-filenames',
        '--windows-filenames',
        '--dump-json',
        '--no-download',
        url,
      ];
      const { stdout } = await runYtDlp(ytDlpPath, fallbackArgs, 45000);
      return JSON.parse(stdout);
    }
    throw err;
  }
}

/**
 * Download video using yt-dlp with automatic fallback.
 */
async function downloadVideo(url, outputPath, format, ytDlpPath) {
  const formatArgs = [];
  if (format && format !== 'best') {
    formatArgs.push('-f', `bestvideo[height<=${format}]+bestaudio/best[height<=${format}]/best`);
  } else {
    formatArgs.push('-f', 'bestvideo+bestaudio/best');
  }

  const baseArgs = [
    ...buildBaseArgs(),
    '-o', outputPath,
    ...formatArgs,
    '--merge-output-format', 'mp4',
    url,
  ];

  // Attempt 1: with extractor-args
  try {
    await runYtDlp(ytDlpPath, baseArgs, 300000);
    return;
  } catch (err) {
    // Fallback without extractor-args
    if (err.message.includes('player_client') || err.message.includes('extractor')) {
      const fallbackArgs = [
        '--no-warnings',
        '--restrict-filenames',
        '--windows-filenames',
        '-o', outputPath,
        ...formatArgs,
        '--merge-output-format', 'mp4',
        url,
      ];
      await runYtDlp(ytDlpPath, fallbackArgs, 300000);
      return;
    }
    throw err;
  }
}

/**
 * Safely delete a file, ignoring errors
 */
function safeDelete(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Ignore cleanup errors
  }
}

module.exports = { findYtDlpPath, getVideoInfo, downloadVideo, safeDelete };
