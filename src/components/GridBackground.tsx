import { useEffect, useRef } from 'react'

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let frameId = 0
    let lastTime = 0
    let offsetX = 0
    let offsetY = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = (time = 0) => {
      const dt = lastTime ? (time - lastTime) / 1000 : 0
      lastTime = time
      const speed = 18
      const grid = 60
      offsetX = (offsetX + speed * dt + grid) % grid
      offsetY = (offsetY - speed * dt + grid) % grid

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(24, 72, 52, 0.18)'
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2
      const startX = -grid + offsetX
      const startY = -grid + offsetY

      for (let x = startX; x <= width + grid; x += grid) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = startY; y <= height + grid; y += grid) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      frameId = requestAnimationFrame(tick)
    }

    resize()
    tick()

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-100"
      aria-hidden
    />
  )
}
