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


  const onDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: startX, clientY: startY } = e;
    const handle = e.currentTarget
    const wrapper = handle.closest(".y-frame")! as HTMLDivElement
    const rect = wrapper.querySelector(".top-bar")!.getBoundingClientRect()
    const offsetX = startX - rect.left
    const offsetY = startY - rect.top

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const { clientX: currentX, clientY: currentY } = e

      yframe.set("x", currentX - offsetX)
      yframe.set("y", currentY - offsetY)
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

    const currentWidth = (wrapper.offsetWidth - borderWidth) / scale
    const currentHeight = (wrapper.offsetHeight - borderWidth - topBarHeight) / scale

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const { clientX: newX, clientY: newY } = e

      const diffX = newX - startX
      const diffY = newY - startY

      yframe.set("width", currentWidth + diffX / scale)
      yframe.set("height", currentHeight + diffY / scale)
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

      yframe.set("scale", newWidth / startWidth * startScale)
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
          ??
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