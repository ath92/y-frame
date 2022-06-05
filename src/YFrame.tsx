import React, { useCallback, useEffect, useMemo, useState } from "react"
import * as Y from "yjs"
import { FrameMapType, Frame } from "./store"
import useRenderOnChange from "./useRenderOnChange"

type Props = {
  frame: Y.Map<FrameMapType>
}

function YFrame({
  frame: yframe
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
    const offsetX = startX - wrapper.offsetLeft
    const offsetY = startY - wrapper.offsetTop

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

    const currentWidth = wrapper.offsetWidth / scale
    const currentHeight = wrapper.offsetHeight / scale

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
      top: frame.y,
      left: frame.x,
      width: frame.width * frame.scale,
      height: frame.height * frame.scale,
    }}>
      <iframe src={frame.url} title={frame.url} style={{
        transform: `scale(${frame.scale})`,
        width: frame.width,
        height: frame.height,
      }} />
      <div className="resize handle" onMouseDown={onResize} />
      <div className="zoom handle" onMouseDown={onZoom} />
      <div className="drag handle" onMouseDown={onDrag}></div>
    </div>
  )
}

export default YFrame;