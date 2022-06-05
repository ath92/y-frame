import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";



const url = new URLSearchParams(location.href)

const yRoom = url.get("y-room");

if (yRoom) {
  // Create your SyncedStore store
  const doc = new Y.Doc()
  
  const webrtcProvider = new WebrtcProvider(yRoom, doc as any, 
    // @ts-ignore
    { signaling: ['ws://localhost:4444'] }
  );

  const state = doc.getMap("state")

  state.observe(() => {
    document.querySelector("#count")!.textContent = state.get("count") as string
  })

  const button = document.querySelector("#add")
  
  button?.addEventListener("click", () => {
    let current = state.get("count")
    if (Number.isNaN(current)) current = 0
    state.set("count", current as number + 1)
  })
  
  
} else {
  document.querySelector("#count")!.textContent = "no room in url"
}
