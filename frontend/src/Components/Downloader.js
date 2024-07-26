import React from "react";

function Downloader() {
  return (
    <>
      <div class="d-flex flex-column justify-content-center align-items-center vh-100">
        <div class="head mb-4">
            <h1>Video Downloader</h1>
        </div>
        <div class="d-flex align-items-center">
            <input type="text" class="form-control me-2 border-success border-2 rounded-10" placeholder="Enter video URL" />
            <input type="submit" value="Download" class="btn btn-success"/>
        </div>
    </div>
    </>
  );
}

export default Downloader;
