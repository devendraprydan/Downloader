import React from "react";
import "./App.css";
import Downloader from './Components/Downloader';
import InstaDownloader from './Components/InstaDownloader';
import WeatherDateToggle from "./Components/WeatherDateToggle";
import Navbar from "./Components/Navbar";
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
    </Router>
  </>
  );
}

export default App;
