const express = require('express')
const app = express()
const port = 5000
const cors=require('cors');
const ytdl = require('ytdl-core');
const {chain,forEach}=require('lodash');
const ffmpeg=require('ffmpeg-static');

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

app.get('/api/get-video-info/:videoId',async(req,res)=>{
  const {videoId}=req.params;
  const {videoDetails,formats}=await ytdl.getInfo(videoId);
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

// app.get('/video-download',async(req,res)=>{
//   const {id,resu}=req.query;
//   try {
//     const {videoDetails:{title},formats}=await ytdl.getInfo(id);
//     // console.log(formats);
//     const videoFormate=chain(formats).filter((height,codece)=>{
//       height && height === parseInt(resu)&& codece ?.startsWith('avcl')
//     }).orderBy('fps','desc').head().value()
    
//     const streams={};
//     streams.video=ytdl(id,{quality:videoFormate.itag})
//     streams.audio=ytdl(id,{quality:'highestaudio'})

//     const pipes={
//       out:1,
//       err:2,
//       video:3,
//       audio:4
//     }

//   } catch (error) {
//     console.log(error); 
//   }
// })

app.get('/', (req, res) => {
  res.send('Start')
})

app.listen(port, () => {  
  console.log(`Example app listening on port ${port}`)
})