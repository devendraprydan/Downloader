import React from 'react'

export default function Yt_download_guide() {
  return (
    <div className='flex justify-center yt-downloader-guide flex-col overflow-hidden'>

      <div className='flex justify-center'>
        <h1 className='guide-Heading'>Comprehsive Guide to Downloading YoutTube Video Effortlessly</h1>
      </div>

      <div className="guide-card-1 flex justify-center gap-5">
        <div className="guide-first flex flex-col gap-4">
          <img src="/Images/ss.png" height={500} width={500} alt='not-found'></img>
          <ul>
            <p>Step 1: Paste the YouTube Video Link</p>
            <li>Copy the YouTube URL of the video you want to download.</li>
            <li>In the input field on our homepage, paste the link.</li>
          </ul>
        </div>

        <div className="guide-first flex flex-col gap-5">
          <img src="/Images/ss2.png" height={500} width={500} alt='not-found'></img>
          <ul>
            <p>Step 2: Click the Search Icon </p>
            <li>After pasting the video link, click the search icon.</li>
            <li>This will fetch important information about the video, such as the title, duration, and available quality options..</li>
          </ul>
        </div>
      </div>

      <div className="guide-card-2 flex justify-center gap-5">
        <div className="guide-first flex flex-col gap-4">
          <img src="/Images/ss.png" height={500} width={500} alt='not-found'></img>
          <ul>
            <p>Step 3: Choose the Video Quality</p>
            <li>After fetching the video information, you'll be presented with different quality options such as 1080p, 720p, 480p, and mor</li>
            <li>Select the video resolution that best suits your needs. Higher quality means better resolution but larger file size.</li>
          </ul>
        </div>

        <div className="guide-first flex flex-col gap-5">
          <img src="/Images/ss2.png" height={500} width={500} alt='not-found'></img>
          <ul>
            <p>Step 4: Click the "Download" Button</p>
            <li>Once you’ve selected the desired quality, click the “Download” button</li>
            <li>The download process will start, and depending on the size and speed of your connection, the video will be saved to your device shortly.</li>
          </ul>
        </div>
      </div>


    </div>
  )
}
