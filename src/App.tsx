import YFrame from "./YFrame";
import * as Y from "yjs";
import { Frame, FrameMapType, frames } from "./store";
import "./App.css";
import useRenderOnChange from "./useRenderOnChange";
import { v4 as uuid } from "uuid"

const frameUrls = [
  "https://www.tomhutman.nl",
  "https://www.maanraket.nl/experiments/chesspath",
  "https://www.legowelt.org",
]

let i = 0;
const generateFrame: () => Frame = () => {
  i++;
  return {
    id: uuid(),
    url: frameUrls[i % frameUrls.length],
    x: 0, y: 0,
    width: 300, height: 200,
    scale: 1,
  }
}

const handleClick = () => frames.push([new Y.Map<FrameMapType>(Object.entries(generateFrame()))])

function App() {
  useRenderOnChange(frames)

  return (
    <div className="App">
      <button onClick={handleClick}>Add frame</button>
      {frames.map((f, i) => (
        <YFrame frame={f} key={f.get("id")} />
      ))}
    </div>
  );
}

export default App;
