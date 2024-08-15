import "./App.css";
import Downloader from "./Components/Downloader";
import { useState } from "react";
import WeatherDateToggle from "./Components/WeatherDateToggle";
import Navbar from "./Components/Navbar";

function App() {

  //Navbar States
  //label
  const [label, setLabel] = useState("Light-Mode");
  //background
  const [background, setBackground] = useState("bg-light");
  //Text
  const [text, setText] = useState("text-dark");
  //border

  const Toggle = (() => {
    
    if (label === "Light-Mode") {
      setLabel("Dark-Mode");
      setBackground("bg-dark");
      setText("text-light");
    }
    else {
      setLabel("Light-Mode");
      setBackground("bg-light");
      setText("text-dark");
    }
  })
  return (
    <>
    <WeatherDateToggle/>
    <Downloader></Downloader>
    <Navbar />
    </>
  );
}

export default App;
