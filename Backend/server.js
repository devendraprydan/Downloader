const express = require('express')
const app = express()
const cors = require('cors')
const ytdl = require('ytdl-core')
const dotenv = require('dotenv')

dotenv.config()

app.use(express.json())

if (process.env.mode === 'production') {
    app.use(cors())
} else {
    app.use(cors({
        origin: 'http://localhost:3000'
    }))
}

const getResolutions = (formats) => {
    const resuArray = formats.filter(format => format.qualityLabel).map(format => format.height);
    return [...new Set(resuArray)];
}

app.get('/api/get-video-info/:videoId', async (req, res) => {
    const { videoId } = req.params;
    
    try {
        const { videoDetails, formats } = await ytdl.getInfo(videoId);
        const { title, thumbnails } = videoDetails;
        const videoResolutions = getResolutions(formats);
        
        return res.status(200).json({
            videoInfo: {
                title,
                thumbnailUrl: thumbnails[thumbnails.length - 1].url,
                videoResolutions, // Ensure this key matches frontend
                lastResu: videoResolutions[0],
            }
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Failed to fetch video info' });
    }
});

const port = 5000;
app.listen(port, () => console.log(`Server is running on port ${port}!`));
