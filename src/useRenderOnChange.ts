import { useEffect, useState } from "react"
import * as Y from "yjs"

export default <T = any>(item: Y.Map<T> | Y.Array<T>) => {
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        const onChange = () => setCounter((i) => i + 1)
        item.observe(onChange)
        return () => item.unobserve(onChange)
    }, [])
    // you'll probably never need this, but just in case you want something else to also depend on it
    return counter
}