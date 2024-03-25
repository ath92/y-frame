import React, { useCallback } from "react"
import { FrameMapType, Frame } from "./store"

type Props = {
  onClose: (id: string) => void
  updateFrame: (frameId: string, key: string, value: FrameMapType) => void
} & Frame

const topBarHeight = 30
const borderWidth = 2

const MIN_WIDTH = 300
const MIN_HEIGHT = 300

function YFrame({
  onClose,
  updateFrame,
  id,
  url,
  width,
  height,
  x,
  y,
  scale,
}: Props) {
  const updateCurrentFrame = useCallback((key: string, value: FrameMapType) => {
    updateFrame(id, key, value)
  }, [updateFrame, id])

  const onDrag = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const startX = "clientX" in e ? e.clientX : e.touches[0].pageX
    const startY = "clientY" in e ? e.clientY : e.touches[0].pageY
    if ((e.target as HTMLElement).tagName === "BUTTON") {
      return;
    }
    const handle = e.currentTarget
    const wrapper = handle.closest(".y-frame")! as HTMLDivElement
    const rect = wrapper.getBoundingClientRect()
    const offsetY = startY - rect.top

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      const currentX = "clientX" in e ? e.clientX : e.touches[0].pageX
      const currentY = "clientX" in e ? e.clientY : e.touches[0].pageY

      updateCurrentFrame("x", rect.left + (currentX - startX))
      updateCurrentFrame("y", rect.top + (currentY - startY))
    }

    handle.classList.toggle("handling", true)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("touchmove", onMouseMove)
    const cleanup = () => {
      handle.classList.toggle("handling", false)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("touchmove", onMouseMove)
      window.removeEventListener("mouseup", cleanup)
      window.removeEventListener("touchend", cleanup)
    }
    window.addEventListener("mouseup", cleanup)
    window.addEventListener("touchend", cleanup)
  }, [])

  const onResize = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: startX, clientY: startY } = e;
    const handle = e.currentTarget
    const vertical = handle.classList.contains("top") ? "top"
      : handle.classList.contains("bottom") ? "bottom"
      : "none" 
    const horizontal = handle.classList.contains("left") ? "left"
      : handle.classList.contains("right") ? "right"
      : "none" 

    const wrapper = handle.closest(".y-frame")! as HTMLDivElement
    const rect = wrapper.getBoundingClientRect()

    const currentWidth = (rect.width - borderWidth) / scale
    const currentHeight = (rect.height- borderWidth)  / scale - topBarHeight
    const currentX = rect.left
    const currentY = rect.top

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const { clientX: newX, clientY: newY } = e

      const diffX = newX - startX
      const diffY = newY - startY

      const newWidth = Math.max(
        horizontal === "right" ?
        currentWidth + diffX / scale:
        horizontal === "left" ?
        currentWidth - diffX / scale:
        currentWidth,
        MIN_WIDTH);

      updateCurrentFrame("width", newWidth)
        
      if (horizontal === "left") updateCurrentFrame("x", currentX + diffX)
        
      const newHeight = Math.max(
        vertical === "bottom" ?
        currentHeight + diffY / scale:
        vertical === "top" ?
        currentHeight - diffY / scale:
        currentHeight,
        MIN_HEIGHT);

      
      updateCurrentFrame("height", newHeight)
      if (vertical === "top") updateCurrentFrame("y", currentY + diffY)
    }

    handle.classList.toggle("handling", true)
    window.addEventListener("mousemove", onMouseMove)
    const cleanup = () => {
      handle.classList.toggle("handling", false)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", cleanup)
    }
    window.addEventListener("mouseup", cleanup)
  }, [scale])

  const onZoom = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: startMouseX, clientY: startMouseY } = e;
    const handle = e.currentTarget
    const wrapper = handle.closest(".y-frame")! as HTMLDivElement
    const rect = wrapper.getBoundingClientRect()
    const startWidth = rect.width
    const startHeight = rect.height
    const startY = rect.top
    const startX = rect.left
    const iframe = wrapper.querySelector("iframe")!
    const startScale = iframe.getBoundingClientRect().width / iframe.offsetWidth
    const horizontal = handle.classList.contains("left") ? "left"
      : handle.classList.contains("right") ? "right"
      : "none" 
    const vertical = handle.classList.contains("top") ? "top"
      : handle.classList.contains("bottom") ? "bottom"
      : "none" 

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const { clientX: currentMouseX, clientY: currentMouseY } = e

      if (horizontal !== "none") {
        const isLeft = horizontal === "left"
        const sign = isLeft ? -1 : 1;
        const newWidth = startWidth + (currentMouseX - startMouseX) * sign
        updateCurrentFrame("scale", newWidth / startWidth * startScale)
        if (isLeft) updateCurrentFrame("x", startX + (currentMouseX - startMouseX))
      } else {
        const isTop = vertical === "top"
        const newHeight = startHeight + (currentMouseY - startMouseY)
        updateCurrentFrame("scale", newHeight / startHeight * startScale)
        if (isTop) updateCurrentFrame("y", startY + (currentMouseY - startMouseY))
      }
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
      width: width * scale + borderWidth,
      height: height * scale + topBarHeight + borderWidth,
      transform: `translate3D(${x}px, ${y}px, 0)`,
    }}>
      <div className="top-bar">
        <div className="title" onMouseDown={onDrag}>
          {url}
        </div>
        <div className="close" onClick={() => onClose(id)}>
          ˟
        </div>
      </div>

      <iframe src={url} title={url} style={{
        transform: `scale(${scale})`,
        width: width,
        height: height,
      }} />
      
      <div className="zoom handle left" onMouseDown={onZoom} />
      <div className="zoom handle right" onMouseDown={onZoom} />
      <div className="zoom handle bottom" onMouseDown={onZoom} />

      <div className="resize handle top left" onMouseDown={onResize} />
      <div className="resize handle bottom left" onMouseDown={onResize} />
      <div className="resize handle bottom right" onMouseDown={onResize} />
    </div>
  )
}

export default React.memo(YFrame);