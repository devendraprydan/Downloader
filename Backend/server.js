const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const cors = require('cors');
const ytdl = require('ytdl-core');
const { spawn } = require('child_process');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

app.use(express.json());
app.use(cors());

const getResu = (formats) => {
  let resuArray = [];
  for (let i = 0; i < formats.length; i++) {
    if (formats[i].qualityLabel !== null) {
      resuArray.push(formats[i]);
    }
  }
  return [...new Set(resuArray.map(v => v.height))];
};

app.get('/api/get-video-info/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { videoDetails, formats } = await ytdl.getInfo(id);
    const { title, thumbnails, lengthSeconds } = videoDetails;
    const videoResu = getResu(formats);

    return res.status(200).json({
      videoInfo: {
        title,
        thumbnailUrl: thumbnails[thumbnails.length - 1].url,
        duration: lengthSeconds,
        videoResu,
        lastResu: videoResu[0]
      }
    });
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({ error: 'Failed to get video info' });
  }
});

app.get('/api/video-download2', async (req, res) => {
  const videoURL = req.query.url;
  const quality = req.query.quality;

  console.log(`Downloading video from URL: ${videoURL} with quality: ${quality}`);

  const ytDlpPath = 'C:\\Users\\Piyush\\AppData\\Local\\Programs\\Python\\Python312\\Scripts\\yt-dlp.exe';
  const tempDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  try {
    // Get video info to retrieve the title
    const { videoDetails } = await ytdl.getInfo(videoURL);
    const videoTitle = videoDetails.title.replace(/[<>:"\/\\|?*]+/g, ''); // Clean up invalid characters

    const videoFilePath = path.join(tempDir, `${videoTitle}_video.mp4`);
    const audioFilePath = path.join(tempDir, `${videoTitle}_audio.mp4`);
    const mergedFilePath = path.join(tempDir, `${videoTitle}_merged.mp4`);

    // Download video
    const videoArgs = [
      '-f', `bestvideo[height<=${quality}]`,
      '-o', videoFilePath,
      videoURL
    ];
    const videoProcess = spawn(ytDlpPath, videoArgs);

    videoProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Video download process exited with code ${code}`);
        return res.status(500).send('Error downloading video');
      }

      // Download audio
      const audioArgs = [
        '-f', 'bestaudio',
        '-o', audioFilePath,
        videoURL
      ];
      const audioProcess = spawn(ytDlpPath, audioArgs);

      audioProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Audio download process exited with code ${code}`);
          return res.status(500).send('Error downloading audio');
        }

        // Merge audio and video
        ffmpeg()
          .input(videoFilePath)
          .input(audioFilePath)
          .audioCodec('aac')
          .videoCodec('copy')
          .output(mergedFilePath)
          .on('end', () => {
            console.log('Downloaded and merged successfully');
            // Serve the merged file
            res.download(mergedFilePath, `${videoTitle}.mp4`, (err) => {
              if (err) {
                console.error(`Error sending file: ${err}`);
              }
              // Clean up
              fs.unlink(videoFilePath, (err) => {
                if (err) console.error(`Error deleting video file: ${err}`);
              });
              fs.unlink(audioFilePath, (err) => {
                if (err) console.error(`Error deleting audio file: ${err}`);
              });
              fs.unlink(mergedFilePath, (err) => {
                if (err) console.error(`Error deleting merged file: ${err}`);
              });
            });
          })
          .on('error', (err) => {
            console.error(`FFmpeg error: ${err.message}`);
            res.status(500).send('Error processing video download');
          })
          .run();
      });
    });

    videoProcess.on('error', (err) => {
      console.error(`Video download process error: ${err.message}`);
      res.status(500).send('Error processing video download');
    });
  } catch (error) {
    console.error('Error fetching video info or during download:', error);
    res.status(500).send('Failed to process video');
  }
});

app.get('/', (req, res) => {
  res.send('Start');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
