import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { v4 as uuid } from "uuid"

export type Frame = {
    id: string,
    url: string
    x: number, y: number
    width: number, height: number
    scale: number
    state?: Y.Doc
}

export type FrameMapType = Frame[keyof Frame]

// Create your SyncedStore store
export const doc = new Y.Doc()

export const frames = doc.getMap<Y.Map<FrameMapType>>()

const firstFrameContent = {
    url: "https://www.maanraket.nl/experiments/virtual-doom/",
    x: 0, y: 0,
    width: 600, height: 400,
    scale: 1,
    id: uuid(),
}

const firstFrame = new Y.Map<FrameMapType>(Object.entries(firstFrameContent))

frames.set(firstFrameContent.id, firstFrame)

function connectToWebRTC (doc: Y.Doc, room?: string) {
    new WebrtcProvider(room || doc.guid, doc as any, 
        // @ts-ignore
        { signaling: ['ws://localhost:4444'] }
    );
}

doc.on('subdocs', ({ loaded }) => {
    loaded.forEach((subdoc: Y.Doc) => {
        connectToWebRTC(subdoc)
    })
}) // Get the Set<Y.Doc> of all subdocuments
for(let subdoc of doc.getSubdocs()){
    connectToWebRTC(subdoc)
}

connectToWebRTC(doc, "y-frame")
