const express = require('express')
const app = express()
const port = 5000
const cors=require('cors');
const ytdl = require('ytdl-core');

app.use(express.json());
app.use(cors())

app.get('/api/get-video-info/:videoId',async(req,res)=>{
  const {videoId}=req.params;
  const data=await ytdl.getInfo(videoId);
  console.log(data);
})

app.get('/', (req, res) => {
  res.send('Start')
})

app.listen(port, () => {  
  console.log(`Example app listening on port ${port}`)
})