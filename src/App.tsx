import YFrame from "./YFrame";
import * as Y from "yjs";
import { Frame, FrameMapType, frames } from "./store";
import "./App.css";
import useRenderOnChange from "./useRenderOnChange";
import { v4 as uuid } from "uuid"
import { WebrtcProvider } from "y-webrtc";
import { Fragment } from "react";

const frameUrls = [
  "https://fractal-garden.netlify.app/viewer.html?fractal=klein",
  "https://fractal-garden.netlify.app/viewer.html?fractal=mandelbulb",
  "https://smooth-life.netlify.app/",
  "https://www.maanraket.nl/experiments/chesspath",
  "https://condescending-jepsen-5f5132.netlify.app/",
  "https://www.maanraket.nl/experiments/flock/",
  "https://www.maanraket.nl/experiments/tunnel/",
  "https://www.maanraket.nl/experiments/fractals/",
]

let i = 0;
const generateFrame: () => Frame = () => {
  i++;
  return {
    id: uuid(),
    url: frameUrls[i % frameUrls.length],
    x: 0, y: 0,
    width: 600, height: 400,
    scale: 1,
  }
}

const generateCounterApp: () => Frame = () => {
  i++;
  const guid = uuid()
  const doc = new Y.Doc({ guid })
  doc.getMap("state").set("count", 0)

  return {
    id: guid,
    url: `http://localhost:3001/?room=${guid}`,
    x: 100, y: 100,
    width: window.innerWidth - 200, height: window.innerHeight - 200,
    scale: 1,
    state: doc,
  }
}

const handleNewCounter = () => {
  const newCounter = generateCounterApp()
  frames.set(newCounter.id, new Y.Map<FrameMapType>(Object.entries(newCounter)))
}

const handleClick = () => {
  const newFrame = generateFrame()
  frames.set(newFrame.id, new Y.Map<FrameMapType>(Object.entries(newFrame)))
}

function App() {
  useRenderOnChange(frames)

  return (
    <div className="App">
      <button onClick={handleClick}>Add frame</button>
      <button onClick={handleNewCounter}>Add Counter</button>
      {[...frames].map(([, frame], i) => (
        <Fragment key={frame.get("id")}>  
          <YFrame
            frame={frame}
            
            onClose={() => {
              frames.delete(frame.get("id"))
            }} />
        </Fragment>
      ))}
      {undefined}
    </div>
  );
}

export default App;
