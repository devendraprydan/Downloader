import React from "react";
import "./App.css";
import Downloader from './Components/Downloader';
import InstaDownloader from './Components/InstaDownloader';
import WeatherDateToggle from "./Components/WeatherDateToggle";
import Navbar from "./Components/Navbar";
import Yt_download_guide from "./Components/Yt_download_guide";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {

  return (
  <>
    <Router>
      <WeatherDateToggle />
      <Routes>
        <Route path="/" element={<Downloader />} />
        <Route path="/instadownloader" element={<InstaDownloader />} />
      </Routes>
      <Navbar />
      <Yt_download_guide/>
    </Router>
  </>
  );
}

export default App;
