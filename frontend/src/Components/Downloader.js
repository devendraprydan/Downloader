import React, { useState } from "react";
import axios from 'axios';
import BounceLoader from 'react-spinners/BounceLoader'

function Downloader() {
  
  const [url, Seturl] = useState("");
  const [videoInfo, setvideoInfo] = useState("");
  const [resu, setResu] = useState("");
  const [loader, setLoader] = useState(false);

  const eligible = ((e) => {
    Seturl(e.target.value)
  })

  const get_video_details = (async (e) => {
    e.preventDefault()
    console.log(url);

    const longId = url.split("https://youtu.be/")[1];
    const shortId = url.split("https://youtube.com/shorts/")[1];

    // Seturl("");

    var videoId;
    if (url.includes("shorts")) {
      videoId = shortId
    }
    else {
      videoId = longId
    }

    console.log(videoId);

    try {

      setLoader(true);

      const { data } = await axios.get(`http://localhost:5000/api/get-video-info/${videoId}`)

      setLoader(false)

      setvideoInfo(data.videoInfo);
      setResu(data.videoInfo.lastResu)
    } catch (error) {
      console.log(error.response);
    }
  })

  const video_downloaded=((e)=>{
    e.preventDefault()
    // console.log(url);

    const longId = url.split("https://youtu.be/")[1];
    const shortId = url.split("https://youtube.com/shorts/")[1];

    var videoId;
    if (url.includes("shorts")) {
      videoId = shortId
    }
    else {
      videoId = longId
    }

    const url=`http://localhost:5000/video-download?id=${videoId}&resu=${resu}`
    window.location.href=url;
    // Seturl("");
  })

 
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center main">

        <div className="head">
          <p>Fast & Free Downloader</p>
        </div>

        <div className="d-flex align-items-center container">
          <form onSubmit={get_video_details}>
            <input type="text" className="form-control me-2 border-2 rounded-10 search" placeholder="Enter Video URL..." value={url} onChange={eligible} />
            <input type="submit" value="Download" className="btn2" />
          </form>
        </div>
        <div className="Info-box">
          {
            loader ? <div className="loader">
              <BounceLoader color="#FDD333" />
            </div> : videoInfo && <div className=" d-flex">
              <img src={videoInfo.thumbnailUrl} alt="" height="150px" width="260px" className="thumbnail" />
              <div className="Info-box2 d-flex py-2 px-3 flex-col">
                <p className="videoTitle">{videoInfo.title.slice(0, 50)}...</p>
                <div className="time">Time: 13.40</div>
                <div className="flex gap-4 absolute top-20">
                  <select className="px-3 py-2 outline-none border-indigo\ rounded-md" name="" id="" onChange={(e)=>setResu(e.target.value)}>
                    {
                      videoInfo.videoResu.length>0 && videoInfo.videoResu.map((v,i)=>
                        <option key={i} value={v}>{v}p</option>)
                    }
                  </select>
                  <button onClick={video_downloaded} className="px-3 py-2 bg-yellow-300 text-">Download</button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default Downloader;

//Search icons
// <svg
// xmlns="http://www.w3.org/2000/svg"
// x="0px"
// y="0px"
// width="30"
// height="30"
// viewBox="0,0,300,150"
// style={{ fill: '#1A1A1A' }}
// >
// <g
//     fill="#1a1a1a"
//     fillRule="nonzero"
//     stroke="none"
//     strokeWidth="1"
//     strokeLinecap="butt"
//     strokeLinejoin="miter"
//     strokeMiterlimit="10"
//     strokeDasharray=""
//     strokeDashoffset="0"
//     fontFamily="none"
//     fontWeight="none"
//     fontSize="none"
//     textAnchor="none"
//     style={{ mixBlendMode: 'normal' }}
// >
//     <g transform="scale(8.53333,8.53333)">
//         <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path>
//     </g>
// </g>
// </svg>



