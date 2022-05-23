import React, { useState } from 'react';
import YFrame from "./YFrame";
import "./App.css";

const frameUrls = [
  "https://www.tomhutman.nl",
  "https://www.maanraket.nl/experiments/chesspath",
  "https://www.legowelt.org",
]

let i = 0;
const generateFrame = () => {
  i++;
  return frameUrls[i % frameUrls.length]
}

function App() {
  const [frames, setFrames] = useState<string[]>([frameUrls[0]])

  const handleClick = () => {
    setFrames(current => current.concat(generateFrame()))
  }

  return (
    <div className="App">
      <button onClick={handleClick}>Add frame</button>
      {frames.map((f, i) => (
        <YFrame src={f} key={`${f} ${i}`} />
      ))}
    </div>
  );
}

export default App;
