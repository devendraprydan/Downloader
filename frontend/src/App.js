import "./App.css";
import Downloader from "./Components/Downloader";
import Navbar from "./Components/Navbar";
import { useState } from "react";
// import Top from "./Components/Top";

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
    // <div className="App">
    <>
    {/* <Top/> */}
    <Navbar Toggle={Toggle} label={label} background={background} text={text} />
    <Downloader></Downloader>
    </>
        
    // </div>
  );
}

export default App;
