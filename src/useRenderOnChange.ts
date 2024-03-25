import { useEffect, useState } from "react"
import * as Y from "yjs"

export default <T = any>(item: Y.Map<T> | Y.Array<T>) => {
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        const onChange = () => setCounter((i) => i + 1)
        item.observe(onChange)
        return () => item.unobserve(onChange)
    }, [item])
    // you'll probably never need this, but just in case you want something else to also depend on it
    return counter
}

export function useReRenderOnChange(doc: Y.Doc) {
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        const onChange = () => setCounter((i) => i + 1)
        doc.on("update", onChange)
        doc.on("sync", onChange)
        doc.on("load", onChange)
        doc.on("afterTransaction", onChange)
        return () => doc.off("update", onChange)
    }, [doc])
    return counter
}