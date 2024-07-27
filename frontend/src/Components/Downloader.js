import React from "react";

function Downloader() {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="head mb-4">
            <h1>Video Downloader</h1>
        </div>
        <div className="d-flex align-items-center">
            <input type="text" className="form-control me-2 border-success border-2 rounded-10" placeholder="Enter video URL" />
            <input type="submit" value="Download" className="btn btn-success"/>
        </div>
    </div>
    </>
  );
}

export default Downloader;
