import React, { useCallback, useState } from "react"

type Props = {
  src: string
}

function YFrame({
  src
}: Props) {
  const [[x, y], setPosition] = useState<[number, number]>([0, 0])
  const [[width, height], setSize] = useState<[number, number]>([300, 200])
  const [scale, setScale] = useState(1)

  const onDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: startX, clientY: startY } = e;
    const handle = e.currentTarget
    const wrapper = handle.closest(".y-frame")! as HTMLDivElement
    const offsetX = startX - wrapper.offsetLeft
    const offsetY = startY - wrapper.offsetTop

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const { clientX: currentX, clientY: currentY } = e

      setPosition([currentX - offsetX, currentY - offsetY])
    }

    handle.classList.toggle("handling", true)
    window.addEventListener("mousemove", onMouseMove)
    const cleanup = () => {
      handle.classList.toggle("handling", false)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", cleanup)
    }
    window.addEventListener("mouseup", cleanup)
  }, [])

  const onResize = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: startX, clientY: startY } = e;
    const handle = e.currentTarget
    const wrapper = handle.closest(".y-frame")! as HTMLDivElement
    const iframe = wrapper.querySelector("iframe")!
    const scale = iframe.getBoundingClientRect().width / iframe.offsetWidth

    const currentWidth = wrapper.offsetWidth / scale
    const currentHeight = wrapper.offsetHeight / scale

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const { clientX: newX, clientY: newY } = e

      setSize(() => {
        const diffX = newX - startX
        const diffY = newY - startY
        return [currentWidth + diffX / scale, currentHeight + diffY / scale]
      })
    }

    handle.classList.toggle("handling", true)
    window.addEventListener("mousemove", onMouseMove)
    const cleanup = () => {
      handle.classList.toggle("handling", false)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", cleanup)
    }
    window.addEventListener("mouseup", cleanup)
  }, [])

  const onZoom = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: startX } = e;
    const handle = e.currentTarget
    const wrapper = handle.closest(".y-frame")! as HTMLDivElement
    const iframe = wrapper.querySelector("iframe")!
    const startWidth = startX - wrapper.offsetLeft
    const startScale = iframe.getBoundingClientRect().width / iframe.offsetWidth

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const { clientX: currentX } = e

      const newWidth = currentX - wrapper.offsetLeft

      setScale(newWidth / startWidth * startScale)
    }

    handle.classList.toggle("handling", true)
    window.addEventListener("mousemove", onMouseMove)
    const cleanup = () => {
      handle.classList.toggle("handling", false)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", cleanup)
    }
    window.addEventListener("mouseup", cleanup)
  }, [])

  return (
    <div className="y-frame" style={{
      top: y,
      left: x,
      width: width * scale,
      height: height * scale,
    }}>
      <iframe src={src} title={src} style={{
        transform: `scale(${scale})`,
        width: width,
        height: height,
      }} />
      <div className="resize handle" onMouseDown={onResize} />
      <div className="zoom handle" onMouseDown={onZoom} />
      <div className="drag handle" onMouseDown={onDrag}></div>
    </div>
  )
}

export default YFrame;