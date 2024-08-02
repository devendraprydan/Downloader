const express = require('express')
const path = require('path')
const app = express()
const port = 5000
// const getVideoID = require('get-video-id')
const cors=require('cors');
const ytdl = require('ytdl-core');
const {chain,forEach}=require('lodash');
const ffmpeg=require('ffmpeg-static');
const fs = require('fs');
// const { url } = require('inspector');
const { exec, spawn } = require('child_process');
const { url } = require('inspector');

app.use(express.json());
app.use(cors())

const getResu=(formats)=>{
  let resuArray=[];

  for(let i=0;i<formats.length;i++)
  {
    if(formats[i].qualityLabel!==null)
    {
      resuArray.push(formats[i])
    }
  }
  return [...new Set(resuArray.map(v=>v.height))]
}

app.get('/api/get-video-info/:id',async(req,res)=>{
  const {id}=req.params;
  const {videoDetails,formats}=await ytdl.getInfo(id);
  const {title,thumbnails}=videoDetails;
  const videoResu=getResu(formats);

  return res.status(200).json({
    videoInfo: {
      title,
      thumbnailUrl:thumbnails[thumbnails.length-1].url,
      videoResu,
      lastResu:videoResu[0]
    }
  })
})
// C:\Users\Devendra Bharvad\AppData\Local\Programs\Python\Python312\Lib\site-packages
app.get('/api/video-download', async(req,res)=>{
  const videoURL = 'https://youtu.be/5XcbtFDDLK0?si=MQqm6ypYaVgpBKIT';
  exec(`yt-dlp -f mp4 -o - "${videoURL}"`, (error, stdout, stderr) => {
    if (error) {
        console.error('Error downloading the video:', error);
        res.status(500).send('Error downloading the video');
        return;
    }
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    res.setHeader('Content-Type', 'video/mp4');
    res.send(stdout);
});
})

app.get('/api/video-download2', (req, res) => {

  const videoURL = req.query.url;

  const process = spawn('C:\\Users\\Devendra Bharvad\\AppData\\Local\\Programs\\Python\\Python312\\Scripts\\yt-dlp.exe', ['-f', 'mp4', '-o', '-', videoURL]);

  process.stdout.on('data', (data) => {
      res.write(data);
  });

  process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });

  process.on('close', (code) => {
      if (code !== 0) {
          console.log(`Process exited with code ${code}`);
          res.status(500).send('Error downloading video');
      } else {
          res.end();
      }
  });
});


app.get('/', (req, res) => {
  res.send('Start')
})

app.listen(port, () => {  
  console.log(`Example app listening on port ${port}`)
})