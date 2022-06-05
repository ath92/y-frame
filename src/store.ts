import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

export type Frame = {
    id: string,
    url: string
    x: number, y: number
    width: number, height: number
    scale: number
}

export type FrameMapType = Frame[keyof Frame]

// Create your SyncedStore store
export const doc = new Y.Doc()

export const frames = doc.getArray<Y.Map<FrameMapType>>()

const firstFrameContent = {
    url: "https://www.tomhutman.nl",
    x: 0, y: 0,
    width: 300, height: 200,
    scale: 1,
}

const firstFrame = new Y.Map<FrameMapType>(Object.entries(firstFrameContent))

frames.insert(0, [firstFrame])

export const webrtcProvider = new WebrtcProvider("y-frame", doc as any, 
// @ts-ignore
{ signaling: ['ws://localhost:4444'] }
);

export const disconnect = () => webrtcProvider.disconnect();
export const connect = () => webrtcProvider.connect();
