'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GOLD = '#C9A84C'
const CYAN = '#00E5FF'

const EVENTS = [
  { name: 'Genève',     date: 'Septembre 2026', flag: '🇨🇭', lat:  46.2, lng:   6.1, iso: 'CHE' },
  { name: 'Riyad',     date: 'Décembre 2026',  flag: '🇸🇦', lat:  24.7, lng:  46.7, iso: 'SAU' },
  { name: 'Denver',    date: 'Avril 2027',      flag: '🇺🇸', lat:  39.7, lng: -104.9, iso: 'USA' },
  { name: 'Londres',   date: 'Juin 2027',       flag: '🇬🇧', lat:  51.5, lng:  -0.1, iso: 'GBR' },
  { name: 'Hong Kong', date: 'Décembre 2027',   flag: '🇭🇰', lat:  22.3, lng: 114.2, iso: 'HKG' },
]

const ROUTES   = [[0,1],[1,2],[2,3],[3,4]] as const
const ARC_COLS = [CYAN, GOLD, CYAN, GOLD]

/* Cumulative clockwise rotation (rad, negative) per waypoint.
   Formula: rotation.y = -(lng × π/180)  → clockwise = eastward
   Geneva→Riyadh: 40.6° | →Denver +208.4° | →London +104.8° | →HK +114.3° */
const ROT_KEYS = [0, -0.709, -4.346, -6.175, -8.171]

function lerpRotation(p: number): number {
  const n  = ROUTES.length
  const fi = p * n
  const i  = Math.min(Math.floor(fi), n - 1)
  const t  = fi - i
  return ROT_KEYS[i] + t * (ROT_KEYS[i + 1] - ROT_KEYS[i])
}

const STEP_ISO = [
  ['CHE'],
  ['CHE','SAU'],
  ['CHE','SAU','USA'],
  ['CHE','SAU','USA','GBR'],
  ['CHE','SAU','USA','GBR','HKG'],
]

/* Fenêtres de visibilité des pings [from, to] en progress 0-1 */
const PING_SHOW: [number, number][] = [
  [0.00, 0.13],  // Genève  — visible au départ
  [0.22, 0.33],  // Riyad   — arrive à p=0.25
  [0.47, 0.58],  // Denver  — arrive à p=0.50
  [0.72, 0.83],  // Londres — arrive à p=0.75
  [0.95, 9.99],  // Hong Kong — reste visible jusqu'à la fin
]
function isPingActive(p: number, i: number): boolean {
  return p >= PING_SHOW[i][0] && p <= PING_SHOW[i][1]
}

/* ── Continent polygons [lng, lat] ──────────────────────────────────────── */
const LAND: [number,number][][] = [
  [[-165,72],[-145,72],[-95,72],[-75,66],[-55,48],[-67,47],[-70,43],[-75,37],[-80,27],[-88,16],[-84,10],[-77,8],[-80,0],[-100,2],[-107,18],[-118,22],[-122,37],[-124,48],[-135,58],[-155,62],[-165,72]],
  [[-77,12],[-62,12],[-50,5],[-36,-5],[-35,-12],[-40,-22],[-48,-28],[-53,-33],[-58,-38],[-62,-52],[-65,-55],[-72,-50],[-76,-42],[-80,-25],[-82,-8],[-80,2],[-77,12]],
  [[-10,72],[-8,58],[0,51],[5,52],[8,55],[10,58],[15,57],[18,60],[25,65],[28,72],[10,72],[0,72],[-10,72]],
  [[5,57],[8,58],[15,58],[20,62],[25,65],[28,71],[25,72],[20,69],[15,65],[10,58],[5,57]],
  [[-9,44],[-1,44],[3,43],[3,37],[-5,36],[-9,37],[-9,44]],
  [[-6,50],[-5,58],[0,59],[-2,57],[-4,52],[-6,50]],
  [[7,44],[12,44],[16,41],[16,38],[15,37],[12,38],[10,44],[7,44]],
  [[-18,38],[12,38],[15,33],[33,31],[37,22],[43,11],[51,12],[44,2],[40,-5],[35,-10],[36,-18],[35,-26],[28,-34],[18,-34],[15,-30],[12,-18],[8,-5],[2,4],[-5,5],[-16,8],[-18,16],[-18,38]],
  [[44,-13],[50,-16],[50,-25],[44,-25],[44,-13]],
  [[25,72],[60,72],[100,70],[140,70],[160,68],[175,65],[175,50],[135,46],[140,38],[135,30],[125,22],[115,22],[105,10],[100,5],[100,-8],[120,-8],[130,5],[140,15],[145,45],[160,50],[140,56],[100,72],[60,72],[25,72]],
  [[68,37],[75,37],[80,29],[82,18],[78,8],[77,8],[70,22],[66,28],[68,37]],
  [[100,-8],[104,-8],[108,2],[115,5],[120,12],[115,22],[105,22],[100,-8]],
  [[37,22],[57,22],[57,14],[48,12],[43,11],[37,14],[37,22]],
  [[-44,84],[-20,84],[-18,76],[-26,68],[-44,60],[-50,60],[-52,68],[-46,76],[-44,84]],
  [[114,-22],[120,-20],[130,-12],[136,-12],[139,-17],[145,-18],[148,-22],[152,-25],[152,-30],[148,-38],[144,-38],[138,-35],[130,-32],[120,-30],[114,-22]],
  [[130,31],[131,33],[133,34],[135,35],[137,36],[140,40],[142,44],[145,44],[143,41],[141,38],[139,36],[137,34],[133,31],[130,31]],
  [[172,-34],[178,-37],[178,-41],[174,-41],[172,-38],[172,-34]],
]

/* ── Canvas texture: neon cyan land on near-black ocean ─────────────────── */
/* Draw GeoJSON country borders onto the globe material as a canvas texture */
function buildBorderCanvas(): HTMLCanvasElement {
  const W = 4096, H = 2048
  const cv  = document.createElement('canvas')
  cv.width  = W; cv.height = H
  const ctx = cv.getContext('2d')!

  // Pure dark background
  ctx.fillStyle = '#020810'
  ctx.fillRect(0, 0, W, H)

  return cv
}

function paintBorders(cv: HTMLCanvasElement, features: unknown[]): void {
  const W = cv.width, H = cv.height
  const ctx = cv.getContext('2d')!

  const px = (lng: number, lat: number): [number, number] => [
    ((lng + 180) / 360) * W,
    ((90 - lat)  / 180) * H,
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawFeature = (f: any, fill: boolean) => {
    const g = f?.geometry
    if (!g) return
    const drawPoly = (rings: [number,number][][]) => {
      ctx.beginPath()
      rings.forEach(ring => {
        let penDown = false
        for (let i = 0; i < ring.length; i++) {
          const [lng, lat] = ring[i]
          if (i > 0 && Math.abs(lng - ring[i-1][0]) > 180) { penDown = false }
          const [x, y] = px(lng, lat)
          if (!penDown) { ctx.moveTo(x, y); penDown = true }
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
      })
      if (fill) ctx.fill()
      else ctx.stroke()
    }
    if (g.type === 'Polygon') drawPoly(g.coordinates)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else if (g.type === 'MultiPolygon') g.coordinates.forEach((p: any) => drawPoly(p))
  }

  const EVENT_ISOS = new Set(['CHE','SAU','USA','GBR','HKG','CHN'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iso = (f: any): string => f?.properties?.ISO_A3 || f?.properties?.ADM0_A3 || ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const regular = (features as any[]).filter(f => !EVENT_ISOS.has(iso(f)))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events  = (features as any[]).filter(f =>  EVENT_ISOS.has(iso(f)))

  // 1. Regular country fills
  ctx.fillStyle = 'rgba(15,95,175,0.75)'
  ctx.shadowBlur = 0
  regular.forEach(f => drawFeature(f, true))

  // 2. Event country fills — gold
  ctx.fillStyle = 'rgba(201,168,76,0.35)'
  events.forEach(f => drawFeature(f, true))

  // 3. Regular borders — crisp, no blur
  ctx.strokeStyle = '#00ccff'
  ctx.lineWidth   = 2.5
  ctx.shadowBlur  = 0
  regular.forEach(f => drawFeature(f, false))

  // 4. Event borders — gold, slightly thicker
  ctx.strokeStyle = '#C9A84C'
  ctx.lineWidth   = 3.5
  ctx.shadowBlur  = 0
  events.forEach(f => drawFeature(f, false))
}

/* ══════════════════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════════════════ */
export default function GlobeSection() {
  const mountRef   = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount   = mountRef.current
    const section = sectionRef.current
    if (!mount || !section) return

    /* ── Closure state filled by the async setup ────────────────────── */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let globeObj: any         = null
    let borderTexRef: THREE.CanvasTexture | null = null
    let arcUpdateFn: ((p: number) => void) | null = null
    const arcGeos: THREE.BufferGeometry[]         = []   // all arc geos for cleanup
    const arcMats: THREE.Material[]              = []   // all arc mats for cleanup
    let needsRender               = true
    let rafId                     = 0
    let renderer: THREE.WebGLRenderer | null        = null
    let onResizeFn: (() => void) | null  = null
    let scrollProgress                              = 0
    let updatePingsFn: ((p: number) => void) | null = null
    const pingEls: HTMLDivElement[]                 = []

    const START_Y = -(6.1 * Math.PI / 180)

    /* ── Pin ScrollTrigger — SYNCHRONOUS ───────────────────────────────
       Must run before page.tsx useEffect so the pin-spacer is in the
       DOM when the Programme section calculates its scroll offset.
       (React effects: child before parent → Globe runs before page.tsx)
    ─────────────────────────────────────────────────────────────────── */
    const pinST = ScrollTrigger.create({
      trigger: section,
      pin: true,
      start: 'top top',
      end: `+=${ROUTES.length * innerHeight * 1.35}`,
      scrub: 1,
      onUpdate(self) {
        if (!globeObj) return
        const p = self.progress
        scrollProgress = p

        /* Globe rotation — keyframed per geographic distance */
        globeObj.rotation.y = START_Y + lerpRotation(p)

        /* All arc draw ranges via THREE.Line setDrawRange (no geometry rebuild) */
        arcUpdateFn?.(p)

        needsRender = true
      },
    })

    /* ── Pings HTML — créés en synchrone, positionnés dans le RAF ──── */
    EVENTS.forEach(ev => {
      const el = document.createElement('div')
      el.className = 'globe-ping'
      Object.assign(el.style, {
        position: 'absolute', pointerEvents: 'none', zIndex: '20',
        opacity: '0', transition: 'opacity 0.45s ease',
        transform: 'translate(-50%, calc(-100% - 10px))',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      })
      el.innerHTML = `
        <div style="
          background:rgba(2,8,16,0.88);
          border:1px solid rgba(201,168,76,0.55);
          border-radius:8px;
          padding:6px 14px 8px;
          backdrop-filter:blur(10px);
          text-align:center;
          min-width:96px;
        ">
          <div style="font-size:1.15rem;margin-bottom:3px">${ev.flag}</div>
          <div style="font-family:var(--font-heading,'Space Grotesk');font-size:.72rem;color:#C9A84C;font-weight:600;letter-spacing:.06em;white-space:nowrap">${ev.name}</div>
          <div style="font-family:var(--font-body,Inter);font-size:.56rem;color:rgba(255,255,255,.45);letter-spacing:.1em;margin-top:3px;text-transform:uppercase">${ev.date}</div>
        </div>
        <div style="width:1px;height:14px;background:linear-gradient(to bottom,rgba(201,168,76,.55),transparent)"></div>
        <div style="width:7px;height:7px;border-radius:50%;background:#C9A84C;box-shadow:0 0 8px #C9A84C,0 0 18px rgba(201,168,76,.35)"></div>
      `
      section.appendChild(el)
      pingEls.push(el)
    })

    /* ── Async Three.js + data setup ────────────────────────────────── */
    ;(async () => {
      const { default: ThreeGlobe } = await import('three-globe')
      const W = mount.clientWidth  || innerWidth
      const H = mount.clientHeight || innerHeight

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.toneMapping = THREE.NoToneMapping
      Object.assign(renderer.domElement.style, { position:'absolute', inset:'0', width:'100%', height:'100%' })
      mount.appendChild(renderer.domElement)

      const scene    = new THREE.Scene()
      const isMobile = window.innerWidth <= 768
      const camera   = new THREE.PerspectiveCamera(45, W / H, 0.1, 2000)
      camera.position.set(0, 20, 340)
      camera.lookAt(0, isMobile ? 55 : 0, 0)   // mobile: globe plus bas, espace en haut

      // Single sun from the right
      const sun = new THREE.DirectionalLight(0xfff8f0, 3.5)
      sun.position.set(300, 80, 180); scene.add(sun)
      // Ambient — enough to see the dark side without killing the shadow
      scene.add(new THREE.AmbientLight(0x334466, 3.5))

      /* Combined texture: earth-dark.jpg base + GeoJSON borders on top */
      const TEX_W = 4096, TEX_H = 2048
      const texCanvas = document.createElement('canvas')
      texCanvas.width = TEX_W; texCanvas.height = TEX_H
      const texCtx = texCanvas.getContext('2d')!
      texCtx.fillStyle = '#020810'
      texCtx.fillRect(0, 0, TEX_W, TEX_H)

      // Load earth-dark.jpg onto canvas
      try {
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const i = new Image(); i.onload = () => res(i); i.onerror = rej
          i.src = '/textures/earth-dark.jpg'
        })
        texCtx.drawImage(img, 0, 0, TEX_W, TEX_H)
      } catch { /* keep dark bg */ }

      // Fetch GeoJSON and paint country borders onto canvas before creating texture
      let allFeatures: unknown[] = []
      try {
        const geoData = await fetch('/data/countries.geojson').then(r => r.json())
        allFeatures = geoData.features
        paintBorders(texCanvas, allFeatures)
      } catch (e) { console.warn('GeoJSON border paint failed', e) }

      borderTexRef = new THREE.CanvasTexture(texCanvas)
      const borderTex = borderTexRef
      borderTex.colorSpace = THREE.SRGBColorSpace
      borderTex.anisotropy = renderer.capabilities.getMaxAnisotropy()
      borderTex.minFilter  = THREE.LinearFilter
      borderTex.magFilter  = THREE.LinearFilter
      borderTex.generateMipmaps = false

      const globe = new ThreeGlobe()
        .bumpImageUrl('/textures/earth-topology.png')
        .showAtmosphere(true)
        .atmosphereColor('#1a6aaa')
        .atmosphereAltitude(0.14)

      globe.globeMaterial(new THREE.MeshPhongMaterial({
        map:       borderTex,
        shininess: 18,
        specular:  new THREE.Color('#1a3a5c'),
      }))
      scene.add(globe)
      globe.rotation.y = START_Y
      globe.rotation.x = 0.12
      globeObj = globe   // ← activates onUpdate

      /* arcGroup lives in scene (not inside globe) so globe.tick()
         never touches our custom lines. Rotation is synced in the RAF. */
      const arcGroup = new THREE.Group()
      scene.add(arcGroup)

      const ARC_N   = 60
      const ARC_R   = 100
      const ARC_ALT = 0.32

      /* Build a Line2 arc from pre-computed pts; returns an update fn that
         animates instanceCount (draw) and linewidth (thick→thin over time). */
      const makeArc = (
        pts: THREE.Vector3[],
        pStart: number,
        pEnd: number,
      ): ((p: number) => void) => {
        const N = pts.length - 1          // segment count
        const geo = new LineGeometry()
        geo.setFromPoints(pts)
        geo.instanceCount = 0
        arcGeos.push(geo as unknown as THREE.BufferGeometry)

        const mat = new LineMaterial({
          color: new THREE.Color(GOLD),
          linewidth: 1.5,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          resolution: new THREE.Vector2(W, H),
        })
        arcMats.push(mat)

        arcGroup.add(new Line2(geo, mat))

        return (p: number) => {
          const prog = Math.max(0, Math.min(1, (p - pStart) / (pEnd - pStart)))
          if (prog === 0 && p < pStart) { geo.instanceCount = 0; return }
          geo.instanceCount = Math.round(prog * N)
          /* Épaissit pendant le tracé, s'affine ensuite */
          const age = pEnd < 1
            ? Math.max(0, Math.min(1, (p - pEnd) / (1 - pEnd)))
            : 0
          mat.linewidth = prog < 1
            ? 1.5 + prog * 3.5          // 1.5 → 5 en cours de tracé
            : Math.max(1.2, 5 - age * 3.8) // 5 → 1.2 en vieillissant
          mat.opacity = prog < 1
            ? 0.8 + prog * 0.15
            : Math.max(0.45, 0.95 - age * 0.5)
          needsRender = true
        }
      }

      /* Helper : points d'arc géodésique standard */
      const buildArcPts = (
        sLat: number, sLng: number, eLat: number, eLng: number,
      ): THREE.Vector3[] => {
        const pts: THREE.Vector3[] = []
        let dLng = eLng - sLng
        if (dLng < -180) dLng += 360
        if (dLng >  180) dLng -= 360
        for (let i = 0; i <= ARC_N; i++) {
          const t    = i / ARC_N
          const lat  = sLat + t * (eLat - sLat)
          const lng  = sLng + t * dLng
          const r    = ARC_R * (1 + ARC_ALT * Math.sin(t * Math.PI))
          const latR = lat * Math.PI / 180
          const lngR = lng * Math.PI / 180
          pts.push(new THREE.Vector3(
            r * Math.cos(latR) * Math.sin(lngR),
            r * Math.sin(latR),
            r * Math.cos(latR) * Math.cos(lngR),
          ))
        }
        return pts
      }

      /* ── Riyadh→Denver : arc est via Pacifique (chemin personnalisé) ── */
      const rdPts: THREE.Vector3[] = []
      for (let i = 0; i <= ARC_N; i++) {
        const t      = i / ARC_N
        const lat    = 24.7 + t * (39.7 - 24.7)
        const lngDeg = 46.7 + t * (255.1 - 46.7)
        const lng    = lngDeg > 180 ? lngDeg - 360 : lngDeg
        const r      = 100 * (1 + 0.38 * Math.sin(t * Math.PI))
        const latR   = lat * Math.PI / 180
        const lngR   = lng * Math.PI / 180
        rdPts.push(new THREE.Vector3(
          r * Math.cos(latR) * Math.sin(lngR),
          r * Math.sin(latR),
          r * Math.cos(latR) * Math.cos(lngR),
        ))
      }

      /* Elevate the 5 event countries in 3D (data already fetched above) */
      if (allFeatures.length > 0) {
        const EVENT_ISOS = new Set(['CHE','SAU','USA','GBR','HKG','CHN'])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventFeatures = allFeatures.filter((f: any) =>
          EVENT_ISOS.has(f?.properties?.ISO_A3 || f?.properties?.ADM0_A3 || '')
        )
        globe
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .polygonsData(eventFeatures as any[])
          .polygonCapColor(() => 'rgba(201,168,76,0.50)')
          .polygonSideColor(() => 'rgba(201,168,76,0.25)')
          .polygonStrokeColor(() => '#ffcc44')
          .polygonAltitude(0.014)
        needsRender = true
      }

      /* ── Arcs : tous dorés, Line2 avec animation de linewidth ── */
      const updateGVA_RYD = makeArc(
        buildArcPts(EVENTS[0].lat, EVENTS[0].lng, EVENTS[1].lat, EVENTS[1].lng),
        0.00, 0.25,
      )
      const updateRYD_DEN = makeArc(rdPts, 0.25, 0.50)
      const updateDEN_LON = makeArc(
        buildArcPts(EVENTS[2].lat, EVENTS[2].lng, EVENTS[3].lat, EVENTS[3].lng),
        0.50, 0.75,
      )
      const updateLON_HKG = makeArc(
        buildArcPts(EVENTS[3].lat, EVENTS[3].lng, EVENTS[4].lat, EVENTS[4].lng),
        0.75, 1.00,
      )

      arcUpdateFn = (p: number) => {
        updateGVA_RYD(p)
        updateRYD_DEN(p)
        updateDEN_LON(p)
        updateLON_HKG(p)
      }

      /* Projette chaque ville sur l'écran et met à jour l'opacité du ping */
      const toCam = new THREE.Vector3(0, 20, 340).normalize()
      updatePingsFn = (p: number) => {
        if (!globeObj) return
        const w = mount.clientWidth, h = mount.clientHeight
        pingEls.forEach((el, i) => {
          const ev  = EVENTS[i]
          const lat = ev.lat * Math.PI / 180
          const lng = ev.lng * Math.PI / 180
          const pos = new THREE.Vector3(
            100 * Math.cos(lat) * Math.sin(lng),
            100 * Math.sin(lat),
            100 * Math.cos(lat) * Math.cos(lng),
          )
          pos.applyEuler(globeObj.rotation)

          /* Projection écran */
          const ndc = pos.clone().project(camera)
          el.style.left = `${(ndc.x * 0.5 + 0.5) * w}px`
          el.style.top  = `${(-ndc.y * 0.5 + 0.5) * h}px`

          /* Visibilité : derrière le globe ou hors fenêtre → caché */
          const behind = pos.dot(toCam) < 0
          const target  = (!behind && isPingActive(p, i)) ? '1' : '0'
          if (el.style.opacity !== target) el.style.opacity = target
        })
      }

      /* RAF — globe.tick() every 2 frames for polygon updates (only 5 polys) */
      let frame = 0
      const tick = () => {
        rafId = requestAnimationFrame(tick)
        arcGroup.rotation.copy(globe.rotation)
        if (++frame % 2 === 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(globe as any).tick?.()
          needsRender = true
        }
        if (needsRender) {
          renderer!.render(scene, camera)
          needsRender = false
        }
        updatePingsFn?.(scrollProgress)
      }
      tick()

      /* Resize */
      onResizeFn = () => {
        const w = mount.clientWidth, h = mount.clientHeight
        camera.aspect = w / h; camera.updateProjectionMatrix()
        renderer!.setSize(w, h)
        arcMats.forEach(m => {
          if (m instanceof LineMaterial) m.resolution.set(w, h)
        })
      }
      window.addEventListener('resize', onResizeFn)
    })()

    return () => {
      pinST.kill()
      cancelAnimationFrame(rafId)
      if (onResizeFn) window.removeEventListener('resize', onResizeFn)
      arcGeos.forEach(g => g.dispose())
      arcMats.forEach(m => m.dispose())
      pingEls.forEach(el => el.parentNode?.removeChild(el))
      if (renderer) {
        renderer.dispose()
        renderer.domElement.parentNode?.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <>
      <style>{`
        .globe-ping { pointer-events: none; }
        .globe-mobile-text  { display: none; }
        .globe-mobile-cities { display: none; }
        @media (max-width: 768px) {
          .globe-left-panel    { display: none !important; }
          .globe-scroll-hint   { display: none !important; }
          .globe-mobile-text   { display: block !important; }
          .globe-mobile-cities { display: flex !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: '#020810' }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 80% at 58% 50%, rgba(0,40,120,.15) 0%, transparent 68%)' }} />

        <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

        {/* Left panel — desktop: centré verticalement / mobile: en haut */}
        <div className="globe-left-panel" style={{ position: 'absolute', left: 'clamp(2rem,5.5vw,6.5rem)', top: '50%', transform: 'translateY(-50%)', zIndex: 10, maxWidth: '280px', pointerEvents: 'none' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-body,Inter)', fontSize: '.65rem', letterSpacing: '.3em', color: GOLD, textTransform: 'uppercase', marginBottom: '1.1rem' }}>
            Expansion mondiale
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading,"Space Grotesk")', fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-.02em', margin: '0 0 1.1rem', color: '#fff' }}>
            5 villes.<br /><span style={{ color: GOLD }}>5 rendez-vous.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '.83rem', color: 'rgba(255,255,255,.36)', lineHeight: 1.76, marginBottom: '2rem' }}>
            NeoTech Forum investit les capitales mondiales de la finance et de la tech.
          </p>
          {/* Destinations — desktop only */}
          <div className="globe-destinations" style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {EVENTS.map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.4rem 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                <span style={{ fontSize: '.88rem' }}>{ev.flag}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '.78rem', color: '#fff', display: 'block', lineHeight: 1.2 }}>{ev.name}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', color: 'rgba(255,255,255,.26)', letterSpacing: '.04em' }}>{ev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bulle texte — mobile uniquement, dans l'espace en bas du globe */}
        <div className="globe-mobile-text" style={{
          position: 'absolute', bottom: '2rem', left: '1.5rem', right: '1.5rem',
          zIndex: 10,
          background: 'rgba(2,8,16,0.78)',
          backdropFilter: 'blur(12px)',
          border: `1px solid rgba(201,168,76,.2)`,
          borderRadius: '10px',
          padding: '1.2rem 1.4rem',
        }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-body,Inter)', fontSize: '.6rem', letterSpacing: '.28em', color: GOLD, textTransform: 'uppercase', marginBottom: '.7rem' }}>
            Expansion mondiale
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading,"Space Grotesk")', fontSize: '1.5rem', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-.02em', margin: '0 0 .5rem', color: '#fff' }}>
            5 villes.<br /><span style={{ color: GOLD }}>5 rendez-vous.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '.78rem', color: 'rgba(255,255,255,.38)', lineHeight: 1.7, margin: 0 }}>
            NeoTech Forum investit les capitales mondiales de la finance et de la tech.
          </p>
        </div>

        {/* Scroll hint — desktop */}
        <div className="globe-scroll-hint" style={{ position: 'absolute', top: 'clamp(5rem,8vh,6rem)', right: 'clamp(2rem,4vw,3.5rem)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '1px', height: '40px', background: `linear-gradient(to bottom,${GOLD}44,transparent)` }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '.52rem', letterSpacing: '.2em', color: 'rgba(255,255,255,.18)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
        </div>
      </section>

      {/* Destinations — mobile uniquement, sous le globe */}
      <div className="globe-mobile-cities" style={{
        background: '#020810', borderTop: '1px solid rgba(201,168,76,.12)',
        flexDirection: 'column', gap: 0,
        padding: '2rem clamp(1.5rem,5vw,2.5rem) 2.5rem',
      }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-body,Inter)', fontSize: '.6rem', letterSpacing: '.28em', color: GOLD, textTransform: 'uppercase', marginBottom: '1.4rem' }}>
          Les villes
        </span>
        {EVENTS.map((ev, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.75rem 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <span style={{ fontSize: '1.2rem' }}>{ev.flag}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '.88rem', color: '#fff', display: 'block', lineHeight: 1.3 }}>{ev.name}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '.68rem', color: 'rgba(255,255,255,.3)', letterSpacing: '.06em' }}>{ev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
