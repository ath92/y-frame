import React, { useCallback, useEffect, useMemo, useState } from "react"
import * as Y from "yjs"
import { FrameMapType, Frame } from "./store"
import useRenderOnChange from "./useRenderOnChange"

type Props = {
  frame: Y.Map<FrameMapType>
  onClose: () => void
}

const topBarHeight = 30
const borderWidth = 2

const MIN_WIDTH = 300
const MIN_HEIGHT = 300

function YFrame({
  frame: yframe,
  onClose,
}: Props) {
  const counter = useRenderOnChange(yframe)

  const frame = useMemo(() => {
    const asObject = Object.fromEntries(yframe.entries()) as Frame
    // console.log(asObject)
    return asObject
  }, [counter, yframe])

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

      yframe.set("x", rect.left + (currentX - startX))
      yframe.set("y", rect.top + (currentY - startY))
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

  const scale = frame.scale

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

      yframe.set("width", newWidth)
        
      if (horizontal === "left") yframe.set("x", currentX + diffX)
        
      const newHeight = Math.max(
        vertical === "bottom" ?
        currentHeight + diffY / scale:
        vertical === "top" ?
        currentHeight - diffY / scale:
        currentHeight,
        MIN_HEIGHT);

      
      yframe.set("height", newHeight)
      if (vertical === "top") yframe.set("y", currentY + diffY)
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
        yframe.set("scale", newWidth / startWidth * startScale)
        if (isLeft) yframe.set("x", startX + (currentMouseX - startMouseX))
      } else {
        const isTop = vertical === "top"
        const newHeight = startHeight + (currentMouseY - startMouseY)
        yframe.set("scale", newHeight / startHeight * startScale)
        if (isTop) yframe.set("y", startY + (currentMouseY - startMouseY))
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
      width: frame.width * frame.scale + borderWidth,
      height: frame.height * frame.scale + topBarHeight + borderWidth,
      transform: `translate3D(${frame.x}px, ${frame.y}px, 0)`,
    }}>
      <div className="top-bar">
        <div className="title" onMouseDown={onDrag}>
          {frame.url}
        </div>
        <div className="close" onClick={onClose}>
          ˟
        </div>
      </div>

      <iframe src={frame.url} title={frame.url} style={{
        transform: `scale(${frame.scale})`,
        width: frame.width,
        height: frame.height,
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

export default YFrame;