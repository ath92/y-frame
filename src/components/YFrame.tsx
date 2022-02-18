import { MouseEventHandler, useEffect, useState } from "react"

type ChromeProps = {
    onMouseDown: MouseEventHandler<HTMLDivElement>
}
const Chrome = ({ onMouseDown }: ChromeProps) => {
    return (
        <div style={{
            position: "absolute",
            top: "0",
            right: 0,
            width: "50%",
            height: "20px",
            background: "white",
            zIndex: 2,
            cursor: "grab"
        }}
        onMouseDown={onMouseDown}
        >
        </div>
    )
}

type Props = {
    src: string,
}

type Position = [number, number]

type State = {
    width: number,
    height: number,
    isDragging: boolean,
    dragStart: Position,
    position: Position,
}

type DragState = {
    
}

const useDrag = (callback: (deltaX: number, deltaY: number) => void) => {

}

const YFrame = ({
    src
}: Props) => {
    const [{width, height, isDragging, position: [left, top] }, setState] = useState<State>({ 
        width: 400,
        height: 300,
        isDragging: false,
        dragStart: [0, 0],
        position: [0, 0],

    })

    const onMouseDown: MouseEventHandler = (e) => {
        setState(old => ({
            ...old,
            isDragging: true,
            dragStart: [
                e.clientX - old.position[0],
                e.clientY - old.position[1],
            ]
        }))
    }

    useEffect(() => {
        if (!isDragging) return
        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            setState(old => ({
                ...old,
                position: [
                    clientX - old.dragStart[0],
                    clientY - old.dragStart[1],
                ]
            }))
        }
        const onMouseUp = () => {
            console.log("stop", top)
            setState(old => ({
                ...old,
                isDragging: false,
            }))
        }
        window.addEventListener("mouseup", onMouseUp)
        window.addEventListener("mousemove", onMouseMove)
        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }
    }, [isDragging])

    return (
        <div style={{ width, height, position: "fixed", top, left, userSelect: "none", zIndex: isDragging ? 10 : 1, resize: "both", background: "#ccc", overflow: "hidden" }}>
            <iframe src={src} width="100%" height="100%" style={isDragging ? { pointerEvents: "none"} : {}} />
            <Chrome
                onMouseDown={onMouseDown}
            />
        </div>
    )
}

export default YFrame