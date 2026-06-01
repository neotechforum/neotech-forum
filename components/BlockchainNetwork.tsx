'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const NODE_COUNT = 90
const MAX_CONNECTIONS = 250
const CONNECTION_THRESHOLD = 18

export default function BlockchainNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 55

    // --- Nodes as a Points system ---
    const nodePositions = new Float32Array(NODE_COUNT * 3)
    const nodeColors = new Float32Array(NODE_COUNT * 3)
    const velocities: number[] = []

    for (let i = 0; i < NODE_COUNT; i++) {
      const idx = i * 3
      nodePositions[idx] = (Math.random() - 0.5) * 90
      nodePositions[idx + 1] = (Math.random() - 0.5) * 55
      nodePositions[idx + 2] = (Math.random() - 0.5) * 35

      const isGold = Math.random() > 0.65
      nodeColors[idx] = isGold ? 0.788 : 1.0     // R
      nodeColors[idx + 1] = isGold ? 0.659 : 1.0 // G
      nodeColors[idx + 2] = isGold ? 0.298 : 1.0 // B

      velocities.push(
        (Math.random() - 0.5) * 0.018,
        (Math.random() - 0.5) * 0.018,
        (Math.random() - 0.5) * 0.009
      )
    }

    const pointGeo = new THREE.BufferGeometry()
    pointGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))
    pointGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3))

    const pointMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(pointGeo, pointMat)
    scene.add(points)

    // --- Connection lines ---
    const linePositions = new Float32Array(MAX_CONNECTIONS * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeo.setDrawRange(0, 0)

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.18,
    })
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineSegments)

    let frame = 0
    let animId: number

    const updateConnections = () => {
      const pos = nodePositions
      const lp = linePositions
      let count = 0

      for (let i = 0; i < NODE_COUNT && count < MAX_CONNECTIONS; i++) {
        const ix = i * 3
        for (let j = i + 1; j < NODE_COUNT && count < MAX_CONNECTIONS; j++) {
          const jx = j * 3
          const dx = pos[ix] - pos[jx]
          const dy = pos[ix + 1] - pos[jx + 1]
          const dz = pos[ix + 2] - pos[jx + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < CONNECTION_THRESHOLD) {
            const base = count * 6
            lp[base] = pos[ix]; lp[base + 1] = pos[ix + 1]; lp[base + 2] = pos[ix + 2]
            lp[base + 3] = pos[jx]; lp[base + 4] = pos[jx + 1]; lp[base + 5] = pos[jx + 2]
            count++
          }
        }
      }

      ;(lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
      lineGeo.setDrawRange(0, count * 2)
    }

    const animate = () => {
      animId = requestAnimationFrame(animate)
      frame++

      const pos = nodePositions
      for (let i = 0; i < NODE_COUNT; i++) {
        const pi = i * 3
        const vi = i * 3
        pos[pi] += velocities[vi]
        pos[pi + 1] += velocities[vi + 1]
        pos[pi + 2] += velocities[vi + 2]

        if (Math.abs(pos[pi]) > 45) velocities[vi] *= -1
        if (Math.abs(pos[pi + 1]) > 27) velocities[vi + 1] *= -1
        if (Math.abs(pos[pi + 2]) > 17) velocities[vi + 2] *= -1
      }

      ;(pointGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true

      if (frame % 2 === 0) updateConnections()

      camera.position.x += (mouse.current.x * 6 - camera.position.x) * 0.04
      camera.position.y += (-mouse.current.y * 4 - camera.position.y) * 0.04
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      pointGeo.dispose()
      lineGeo.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
