import React, { useState } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";

function InstagramDownloader() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [loader, setLoader] = useState(false);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const getVideoDetails = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/get-instagram-video-info?url=${encodeURIComponent(url)}`
      );

      setLoader(false);
      setVideoInfo(data.videoInfo);
    } catch (error) {
      setLoader(false);
      console.log(error.response);
    }
  };

  const downloadVideo = async () => {
    try {
      setLoader(true);
      const response = await axios({
        url: `http://localhost:5000/api/instagram-video-download?url=${encodeURIComponent(url)}`,
        method: "GET",
        responseType: "blob",
      });

      setLoader(false);

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "instagram_video.mp4");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      setLoader(false);
      console.error("Error downloading video:", error);
    }
  };

  return (
    <div className="main">
      <div className="head">
        <p className="heading">Instagram Video Downloader</p>
        <p className="semi-heading">Download your favorite videos instantly!</p>
      </div>

      <div className="container2">
        <form>
          <input
            type="text"
            className="form-control me-2 border-2 rounded-10 search"
            placeholder="Paste Instagram video link here"
            value={url}
            onChange={handleUrlChange}
            onBlur={getVideoDetails}
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
              style={{ mixBlendMode: "normal" }}
            >
              <g transform="scale(8.53333,8.53333)">
                <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path>
              </g>
            </g>
          </svg>
        </form>
        <p className="privacy-Service">
          By using our service you accept our{" "}
          <a href="#" className="link">
            Terms of service
          </a>{" "}
          and{" "}
          <a className="link" href="#">
            Privacy Policy
          </a>
        </p>
      </div>

      {loader ? (
        <div className="loader">
          <BounceLoader color="#FDD333" />
        </div>
      ) : videoInfo ? (
        <div className="info-box-1">
          <div className="video-title flex flex-col w-[60%]">
            <img src={videoInfo.thumbnailUrl} alt="" className="thumbnail" />
          </div>

          <div className="flex w-[50%] h-[100%] info">
            <div className="flex gap-3 flex-col w-[100%] items-center">
              <p className="font-semibold">{videoInfo.title.slice(0, 55)}...</p>
              <button
                onClick={downloadVideo}
                className="px-3 py-2 bg-green-500 download"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default InstagramDownloader;
