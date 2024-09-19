import React, { useState } from "react";
import axios from "axios";
import getVideoID from "get-video-id";
import BounceLoader from "react-spinners/BounceLoader";

function Downloader() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [resu, setResu] = useState("");
  const [loader, setLoader] = useState(false);
  const [duration, setDuration] = useState("");

  const eligible = (e) => {
    setUrl(e.target.value);
  };

  const { id } = getVideoID(url);

  const formatDuration = (duration) => {
    const seconds = parseInt(duration, 10);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return [h, m, s]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  const get_video_details = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/get-video-info/${id}`
      );

      setLoader(false);
      setVideoInfo(data.videoInfo);
      setResu(data.videoInfo.lastResu);
      setDuration(formatDuration(data.videoInfo.duration));
    } catch (error) {
      setLoader(false);
      console.log(error.response);
    }
  };

  const video_downloaded = async () => {
    try {
      setLoader(true);

      const response = await axios({
        url: `http://localhost:5000/api/video-download2?url=${url}&quality=${resu}`,
        method: 'GET',
        responseType: 'blob', // Important for handling binary data
      });

      setLoader(false);

      // Create a link element and simulate a click to download the file
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'video.mp4'); // Default filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      setLoader(false);
      console.error('Error downloading video:', error);
    }
  };

  return (
    <>
      <div className="main">
        <div className="head">
          <p className="heading">Fast & Free Downloader</p>
          <p className="semi-heading">Your instant downloader, Anytime, Anywhere</p>
        </div>

        <div className="container2">
          <form>
            <input
              type="text"
              className="form-control me-2 border-2 rounded-10 search"
              placeholder="Paste your link here"
              value={url}
              onChange={eligible}
              onBlur={get_video_details}
            />
            <svg
              onClick={get_video_details}
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
            <BounceLoader color="#FDD333" />
          </div>
        ) : videoInfo ? (
          <div className="info-box-1">
            <div className="video-title flex flex-col w-[60%]">
              <img src={videoInfo.thumbnailUrl} className="thumbnail" />
            </div>
            <div className="flex w-[50%] h-[100%] info">
              <div className="flex gap-3 flex-col w-[100%] items-center">
              <p className="font-semibold">{videoInfo.title.slice(0, 55)}...</p>
                <p className="">Duration: {duration}</p>
                <select
                  className="border-indigo rounded-md dropdown font-semibold"
                  onChange={(e) => setResu(e.target.value)}
                  value={resu}
                >
                  {videoInfo.videoResu.length > 0 &&
                    videoInfo.videoResu.map((v, i) => (
                      <option key={i} value={v}> 
                        {v}p
                      </option>
                    ))}
                </select>
                <button onClick={video_downloaded} className="px-3 py-2 bg-green-500 download">
                  Download
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Downloader;

