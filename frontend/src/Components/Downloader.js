import React, { useState } from "react";
import axios from 'axios';
import BounceLoader from 'react-spinners/BounceLoader';

function Downloader() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [resu, setResu] = useState("");
  const [loader, setLoader] = useState(false);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const getVideoDetails = async (e) => {
    e.preventDefault();
    const longId = url.split("https://youtu.be/")[1];
    const shortId = url.split("https://youtube.com/shorts/")[1];

    let videoId;
    if (url.includes("shorts")) {
      videoId = shortId;
    } else {
      videoId = longId;
    }

    try {
      setLoader(true);
      const { data } = await axios.get(`http://localhost:5000/api/get-video-info/${videoId}`);
      console.log('Video Info:', data.videoInfo); // Add logging here
      setVideoInfo(data.videoInfo);
      setResu("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const downloadVideo = (e) => {
    e.preventDefault();
    const longId = url.split("https://youtu.be/")[1];
    const shortId = url.split("https://youtube.com/shorts/")[1];

    let videoId;
    if (url.includes("shorts")) {
      videoId = shortId;
    } else {
      videoId = longId;
    }

    const link = `http://localhost:5000/video-download?id=${videoId}&resu=${resu}`;
    window.location.href = link;
  };

  return (
    <>
      <div className="main">
        <label className="switch">  
          <input type="checkbox" id="toggle-switch"/>  
          <span className="slider round"></span>  
        </label>  
        <div className="head">
          <p className="heading">Fast & Free Downloader</p>
          <p>Your instant downloader, Anytime, Anywhere</p>
        </div>

        <div className="container2">
          <form>
            <input
              type="text"
              className="form-control me-2 border-2 rounded-10 search"
              placeholder="Paste your link here"
              value={url}
              onChange={handleUrlChange}
            />
            <svg
              onClick={getVideoDetails}
              className="search2"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0,0,300,150"
            >
              <g
                fill="red"
                fillRule="nonzero"
                stroke="red"
                strokeWidth="2"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
                style={{ mixBlendMode: 'normal' }}
              >
                <g transform="scale(8.53333,8.53333)">
                  <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path>
                </g>
              </g>
            </svg>
          </form>
          <p className="privacy-Service">
            By using our service you accept our <a href="#" className="link">Terms of service</a> and <a className="link" href="#">Privacy Policy</a>
          </p>
        </div>

          {loader ? (
            <div className="loader">
              <BounceLoader color="#FDD333"/>
            </div>
          ) : videoInfo ? (
            <div className="d-flex info-box-1">

              <div className="video-title flex flex-col w-[60%]">
                <p className="videoTitle">{videoInfo.title.slice(0, 55)}...</p>
                <img src={videoInfo.thumbnailUrl} alt="" className="thumbnail" />
              </div>
 
              <div className="flex text-right ml-7 w-[40%] justify-center qt h-[95%]">
                <div className="flex gap-10 flex-col qt-dow">
                <p className="time font-semibold">Time: 13:40</p>
                  <select
                    className="px-3 py-2 border-indigo rounded-md dropdown font-semibold"
                    onChange={(e) => setResu(e.target.value)}
                    value={resu}
                  >
                    <option value="" disabled className="bg-transparent">Quality</option>
                    {videoInfo.videoResolutions && videoInfo.videoResolutions.length > 0 ? (
                      videoInfo.videoResolutions.map((v, i) => (
                        <option key={i} value={v} className="bg-transparent">{v}p</option>
                      ))
                    ) : (
                      <option value="" disabled>No Resolutions Available</option>
                    )}
                  </select>
                  <button onClick={downloadVideo} className="px-3 py-2 bg-green-500 download">Download</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
    </>
  );
}

export default Downloader;
