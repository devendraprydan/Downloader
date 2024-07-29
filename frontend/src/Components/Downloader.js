import React, { useState } from "react";
import axios from 'axios';

function Downloader() {
  const [url, Seturl] = useState("");
  const [videoInfo,setvideoInfo]=useState("");
  const eligible = ((e) => {
    Seturl(e.target.value)
  })

  const get_video_details=(async(e)=>{
      e.preventDefault()
      console.log(url);

      const videoId=url.split("https://youtu.be/")[1];
      Seturl("");

      try {
        const {data}=await axios.get(`http://localhost:5000/api/get-video-info/${videoId}`)
        console.log(data);
      } catch (error) {
        console.log(error.response);
      }
  })

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center main">

        <div className="head">
          <p>  <img width="55" height="50" src="https://img.icons8.com/external-kmg-design-glyph-kmg-design/64/1A1A1A/external-download-user-interface-kmg-design-glyph-kmg-design.png" alt="external-download-user-interface-kmg-design-glyph-kmg-design" /> Video Downloader </p>
        </div>

        <div className="d-flex align-items-center container">
          <form onSubmit={get_video_details}>
            <input type="text" className="form-control me-2 border-2 rounded-10 search" placeholder="Enter Video URL..." value={url} onChange={eligible} />
            <input type="submit" value="Download" className="btn2"/>
          </form>
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



