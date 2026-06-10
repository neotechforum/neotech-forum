'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
   Photos — remplacez les seeds picsum par vos vraies URLs :
   P.s1  → panorama Genève (hero)
   P.s2  → salle de conférence
   P.s3  → Genève de nuit / vue lac
   P.s4  → photo événement / networking
   P.s5  → Hôtel Métropole Genève (façade ou terrasse)
   P.sp1 → portrait Maxime Vidal
   P.sp2 → portrait Jonathan Oks
───────────────────────────────────────────────────────────────────────── */
const P = {
  s1:  'https://picsum.photos/seed/gva-hero/1920/1080',
  s2:  'https://picsum.photos/seed/gva-conf/1920/1080',
  s3:  'https://picsum.photos/seed/gva-night/1920/1080',
  s4:  'https://picsum.photos/seed/gva-event/1920/1080',
  s5:  'https://picsum.photos/seed/hotel-gva/1920/1080',
  sp1: 'https://picsum.photos/seed/speaker-mv/600/600',
  sp2: 'https://picsum.photos/seed/speaker-jo/600/600',
};

/* Palette */
const BLUE  = '#00AAFF';
const CYAN  = '#00E5FF';
const BLUE2 = '#1A6AFF';
const GOLD  = '#C9A84C';
const GOLDB = '#FFD166';
const NAVY  = '#020B18';

/* Scene boundaries (virtual-vh, total = 750) */
const TOTAL = 750;
const S1E = 100, S2E = 250, S3E = 380, S4E = 520, S5E = 650;

const norm = (v: number, a: number, b: number) => Math.max(0, Math.min(1, (v - a) / (b - a)));
const fadeAlpha = (vh: number, s: number, e: number, f = 22) =>
  Math.min(norm(vh, s, s + f), norm(vh, e, e - f));

function setA(el: HTMLElement | null, a: number) {
  if (!el) return;
  const v = Math.max(0, Math.min(1, a));
  el.style.opacity    = v.toFixed(3);
  el.style.visibility = v > 0.005 ? 'visible' : 'hidden';
}

function mkMesh(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  pos?: [number, number, number],
  rot?: [number, number, number],
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  return m;
}

const ADD = THREE.AdditiveBlending;

const TOPICS = [
  'IA Générative', 'Blockchain', 'DeFi', 'Cybersécurité',
  'Web3', 'Smart Contracts', 'Gouvernance Data', 'Automatisation',
  'Tokenisation', 'NIS2', 'Cryptomonnaie', 'Résilience',
];

/* Light gradient per scene — shifts the ambient light feel */
const LIGHT_GRADS = [
  'radial-gradient(ellipse 65% 55% at 78% -8%, rgba(0,170,255,.18) 0%, transparent 68%)',
  'radial-gradient(ellipse 26% 70% at 50% -6%, rgba(150,205,255,.22) 0%, transparent 65%)',
  'radial-gradient(circle 52% at 50% 52%, rgba(0,229,255,.14) 0%, transparent 65%)',
  'radial-gradient(ellipse 85% 32% at 50% -4%, rgba(0,170,255,.18) 0%, transparent 58%)',
  'radial-gradient(ellipse 100% 40% at 50% 112%, rgba(201,168,76,.12) 0%, transparent 55%)',
  'radial-gradient(circle 42% at 50% 50%, rgba(0,229,255,.2) 0%, transparent 68%)',
];

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* photo background refs */
  const bg1 = useRef<HTMLDivElement>(null);
  const bg2 = useRef<HTMLDivElement>(null);
  const bg3 = useRef<HTMLDivElement>(null);
  const bg4 = useRef<HTMLDivElement>(null);
  const bg5 = useRef<HTMLDivElement>(null);

  /* light + vignette */
  const lightRef = useRef<HTMLDivElement>(null);

  /* text overlays */
  const o1 = useRef<HTMLDivElement>(null);
  const o2 = useRef<HTMLDivElement>(null);
  const o3 = useRef<HTMLDivElement>(null);
  const o4 = useRef<HTMLDivElement>(null);
  const o5 = useRef<HTMLDivElement>(null);
  const o6 = useRef<HTMLDivElement>(null);

  const labelRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Three.js — transparent canvas (alpha: true) ─────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // fully transparent — shows photos behind
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 500);
    camera.position.set(0, 0, 5);

    const cBlue = new THREE.Color(BLUE), cCyan = new THREE.Color(CYAN);
    const cGold = new THREE.Color(GOLD), cGoldB = new THREE.Color(GOLDB);
    const cBlue2 = new THREE.Color(BLUE2), cWhite = new THREE.Color('#fff');

    /* ── S1 · Network hologram over Genève ──────────────────────────── */
    const g1 = new THREE.Group(); scene.add(g1);

    const NEB = 2000, nebP = new Float32Array(NEB*3), nebC = new Float32Array(NEB*3);
    for (let i = 0; i < NEB; i++) {
      nebP[i*3]=(Math.random()-.5)*44; nebP[i*3+1]=(Math.random()-.5)*32; nebP[i*3+2]=(Math.random()-.5)*36;
      const r = Math.random(), c = r>.93?cGold:r>.7?cWhite:r>.42?cCyan:cBlue;
      nebC[i*3]=c.r; nebC[i*3+1]=c.g; nebC[i*3+2]=c.b;
    }
    const nebGeo = new THREE.BufferGeometry();
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebP, 3));
    nebGeo.setAttribute('color',    new THREE.BufferAttribute(nebC, 3));
    g1.add(new THREE.Points(nebGeo, new THREE.PointsMaterial({ size:.024, vertexColors:true, transparent:true, opacity:.55, blending:ADD, depthWrite:false })));

    const NODE_N = 80, nodePos3D: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_N; i++)
      nodePos3D.push(new THREE.Vector3((Math.random()-.5)*18, (Math.random()-.5)*12, (Math.random()-.5)*14));

    const connPts: number[] = [];
    for (let i = 0; i < NODE_N; i++)
      for (let j = i+1; j < NODE_N; j++)
        if (nodePos3D[i].distanceTo(nodePos3D[j]) < 5.0)
          connPts.push(nodePos3D[i].x, nodePos3D[i].y, nodePos3D[i].z, nodePos3D[j].x, nodePos3D[j].y, nodePos3D[j].z);

    const connGeo = new THREE.BufferGeometry();
    connGeo.setAttribute('position', new THREE.Float32BufferAttribute(connPts, 3));
    const connMat = new THREE.LineBasicMaterial({ color:CYAN, transparent:true, opacity:.38, blending:ADD, depthWrite:false });
    g1.add(new THREE.LineSegments(connGeo, connMat));

    const nP = new Float32Array(NODE_N*3), nC = new Float32Array(NODE_N*3);
    nodePos3D.forEach((p, i) => {
      nP[i*3]=p.x; nP[i*3+1]=p.y; nP[i*3+2]=p.z;
      const r = Math.random(), c = r>.85?cGold:r>.5?cCyan:cBlue;
      nC[i*3]=c.r; nC[i*3+1]=c.g; nC[i*3+2]=c.b;
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nP, 3));
    nodeGeo.setAttribute('color',    new THREE.BufferAttribute(nC, 3));
    g1.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({ size:.2, vertexColors:true, transparent:true, opacity:.92, blending:ADD, depthWrite:false })));

    /* ── S2 · Tech scan-lines + data particles over salle ───────────── */
    const g2 = new THREE.Group(); g2.visible = false; scene.add(g2);

    /* horizontal scan lines — subtle grid feel */
    const scanPts: number[] = [];
    for (let i = 0; i < 28; i++) { const y = -7 + i*.55; scanPts.push(-22, y, 0, 22, y, 0); }
    const scanGeo = new THREE.BufferGeometry();
    scanGeo.setAttribute('position', new THREE.Float32BufferAttribute(scanPts, 3));
    g2.add(new THREE.LineSegments(scanGeo, new THREE.LineBasicMaterial({ color:CYAN, transparent:true, opacity:.055, blending:ADD, depthWrite:false })));

    /* floating data particles */
    const dustN = 500, dustP = new Float32Array(dustN*3);
    for (let i = 0; i < dustN; i++) {
      dustP[i*3]=(Math.random()-.5)*32; dustP[i*3+1]=(Math.random()-.5)*20; dustP[i*3+2]=(Math.random()-.5)*12;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustP, 3));
    g2.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ size:.045, color:BLUE, transparent:true, opacity:.32, blending:ADD, depthWrite:false })));

    /* flowing horizontal accent lines */
    const flowPts: number[] = [];
    for (let i = 0; i < 10; i++) { const y=(Math.random()-.5)*10, z=(Math.random()-.5)*6; flowPts.push(-18,y,z,18,y,z); }
    const flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute('position', new THREE.Float32BufferAttribute(flowPts, 3));
    const flowMat = new THREE.LineBasicMaterial({ color:BLUE, transparent:true, opacity:.15, blending:ADD, depthWrite:false });
    g2.add(new THREE.LineSegments(flowGeo, flowMat));

    /* ── S3 · Holographic topology over Genève nuit ─────────────────── */
    const g3 = new THREE.Group(); g3.visible = false; scene.add(g3);

    const cSphereMat = new THREE.MeshStandardMaterial({ color:BLUE2, metalness:.95, roughness:.04, emissive:new THREE.Color(CYAN).multiplyScalar(.72) });
    const cSphere = mkMesh(new THREE.SphereGeometry(.72, 32, 32), cSphereMat);
    g3.add(cSphere);

    /* halo rings */
    ([[ 1.1,.09],[1.8,.034],[2.6,.013]] as [number,number][]).forEach(([r,op]) =>
      g3.add(mkMesh(new THREE.SphereGeometry(r,32,32),
        new THREE.MeshBasicMaterial({ color:CYAN, transparent:true, opacity:op, blending:ADD, depthWrite:false, side:THREE.BackSide })))
    );

    const nodeMeshes: THREE.Mesh[] = [], nodeTargets: THREE.Vector3[] = [], lines3: THREE.Line[] = [];
    const ZERO = new THREE.Vector3();
    for (let i = 0; i < 12; i++) {
      const phi=Math.acos(-1+(2*i)/12), theta=Math.sqrt(12*Math.PI)*phi, r=4.8;
      nodeTargets.push(new THREE.Vector3(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi)));
      const isGold = i%4===3;
      const nMat = new THREE.MeshStandardMaterial({ color:isGold?GOLDB:CYAN, metalness:.8, roughness:.15, emissive:new THREE.Color(isGold?GOLD:CYAN).multiplyScalar(.55) });
      nodeMeshes.push(mkMesh(new THREE.IcosahedronGeometry(.28,0), nMat, [0,0,0]));
      g3.add(nodeMeshes[i]);
      const lGeo = new THREE.BufferGeometry().setFromPoints([ZERO, ZERO]);
      const lMat = new THREE.LineBasicMaterial({ color:isGold?GOLD:CYAN, transparent:true, opacity:.65, blending:ADD, depthWrite:false });
      const ln = new THREE.Line(lGeo, lMat); g3.add(ln); lines3.push(ln);
    }
    g3.add(new THREE.AmbientLight(0x1A3060, .55));
    const pt3a = new THREE.PointLight(cCyan, 10, 28); pt3a.position.set(5,3,5); g3.add(pt3a);
    const pt3b = new THREE.PointLight(cBlue2, 7, 22); pt3b.position.set(-4,-3,-4); g3.add(pt3b);

    /* ── S4 · Vertical light columns — intervenants ─────────────────── */
    const g4 = new THREE.Group(); g4.visible = false; scene.add(g4);

    const col4Colors = [CYAN, GOLDB, BLUE] as const;
    const col4X      = [-4.5, 0, 4.5];
    const columns: THREE.Mesh[] = [], discs4: THREE.Mesh[] = [];

    col4X.forEach((x, i) => {
      const col = col4Colors[i];
      /* tall glowing column */
      const colMat = new THREE.MeshStandardMaterial({ color:col, metalness:.6, roughness:.2, emissive:new THREE.Color(col).multiplyScalar(.65), transparent:true, opacity:.82 });
      const colMesh = mkMesh(new THREE.BoxGeometry(.06, 5, .06), colMat, [x, -20, -2]);
      g4.add(colMesh); columns.push(colMesh);

      /* base glow disc */
      const discMat = new THREE.MeshBasicMaterial({ color:col, transparent:true, opacity:.45, blending:ADD, depthWrite:false });
      const disc = mkMesh(new THREE.CylinderGeometry(.6, .6, .03, 32), discMat, [x, -20, -2]);
      g4.add(disc); discs4.push(disc);

      /* halo ring at top */
      const ringGeo = new THREE.RingGeometry(.15, .4, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color:col, transparent:true, opacity:.55, blending:ADD, depthWrite:false, side:THREE.DoubleSide });
      const ring = mkMesh(ringGeo, ringMat, [x, -17, -2]);
      g4.add(ring);

      /* scattered top particles */
      const bN=50, bArr=new Float32Array(bN*3);
      for (let k=0;k<bN;k++) {
        const a=Math.random()*Math.PI*2, rad=Math.random()*.9;
        bArr[k*3]=x+Math.cos(a)*rad; bArr[k*3+1]=-16+Math.random()*1.5; bArr[k*3+2]=-2+Math.sin(a)*rad*.3;
      }
      const bGeo4=new THREE.BufferGeometry(); bGeo4.setAttribute('position',new THREE.BufferAttribute(bArr,3));
      g4.add(new THREE.Points(bGeo4, new THREE.PointsMaterial({ size:.07, color:col, transparent:true, opacity:.7, blending:ADD, depthWrite:false })));
    });
    g4.add(new THREE.AmbientLight(0x0A1428, .35));

    /* ── S5 · City particle glow over Hôtel Métropole ───────────────── */
    const g5 = new THREE.Group(); g5.visible = false; scene.add(g5);

    const SKY_N=2500, skyP=new Float32Array(SKY_N*3), skyC=new Float32Array(SKY_N*3);
    for (let i = 0; i < SKY_N; i++) {
      skyP[i*3]=(Math.random()-.5)*130; skyP[i*3+1]=Math.random()*18-2; skyP[i*3+2]=-32-Math.random()*50;
      const r=Math.random(), c=r>.8?cGoldB:r>.5?cCyan:cBlue2;
      skyC[i*3]=c.r; skyC[i*3+1]=c.g; skyC[i*3+2]=c.b;
    }
    const skyGeo = new THREE.BufferGeometry();
    skyGeo.setAttribute('position', new THREE.BufferAttribute(skyP, 3));
    skyGeo.setAttribute('color',    new THREE.BufferAttribute(skyC, 3));
    g5.add(new THREE.Points(skyGeo, new THREE.PointsMaterial({ size:.13, vertexColors:true, transparent:true, opacity:.9, blending:ADD, depthWrite:false })));

    /* floating tech particles (near camera) */
    const techN=180, techP=new Float32Array(techN*3);
    for (let i=0;i<techN;i++) { techP[i*3]=(Math.random()-.5)*22; techP[i*3+1]=(Math.random()-.5)*15; techP[i*3+2]=(Math.random()-.5)*12; }
    const techGeo=new THREE.BufferGeometry(); techGeo.setAttribute('position',new THREE.BufferAttribute(techP,3));
    g5.add(new THREE.Points(techGeo, new THREE.PointsMaterial({ size:.07, color:CYAN, transparent:true, opacity:.38, blending:ADD, depthWrite:false })));

    /* ── S6 · CTA burst — navy bg, no photo ─────────────────────────── */
    const g6 = new THREE.Group(); g6.visible = false; scene.add(g6);

    const BN=900, bPos=new Float32Array(BN*3), bTgt=new Float32Array(BN*3), bColArr=new Float32Array(BN*3);
    for (let i=0;i<BN;i++) {
      bPos[i*3]=bPos[i*3+1]=bPos[i*3+2]=0;
      const th=Math.random()*Math.PI*2, ph=Math.random()*Math.PI, r=2.5+Math.random()*5.5;
      bTgt[i*3]=r*Math.sin(ph)*Math.cos(th); bTgt[i*3+1]=r*Math.sin(ph)*Math.sin(th); bTgt[i*3+2]=r*Math.cos(ph);
      const roll=Math.random(), c=roll>.82?cGold:roll>.5?cBlue:cCyan;
      bColArr[i*3]=c.r; bColArr[i*3+1]=c.g; bColArr[i*3+2]=c.b;
    }
    const bGeo=new THREE.BufferGeometry();
    bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
    bGeo.setAttribute('color',    new THREE.BufferAttribute(bColArr, 3));
    g6.add(new THREE.Points(bGeo, new THREE.PointsMaterial({ size:.08, vertexColors:true, transparent:true, opacity:.95, blending:ADD, depthWrite:false })));
    const orb6Mat = new THREE.MeshBasicMaterial({ color:CYAN, transparent:true, opacity:.65, blending:ADD, depthWrite:false });
    const orb6 = mkMesh(new THREE.SphereGeometry(.01, 16, 16), orb6Mat);
    g6.add(orb6);

    /* ── Single ScrollTrigger ────────────────────────────────────────── */
    ScrollTrigger.create({
      trigger: '#scroll-space',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate(self) {
        const vh = self.progress * TOTAL;

        /* reset topic labels every frame */
        labelRefs.current.forEach(el => setA(el, 0));

        /* overlay alphas */
        setA(o1.current, vh < S1E-18 ? 1 : 1-norm(vh, S1E-18, S1E+5));
        setA(o2.current, fadeAlpha(vh, S1E+5,  S2E-5));
        setA(o3.current, fadeAlpha(vh, S2E+5,  S3E-5));
        setA(o4.current, fadeAlpha(vh, S3E+5,  S4E-5));
        setA(o5.current, fadeAlpha(vh, S4E+5,  S5E-5));
        setA(o6.current, norm(vh, S5E+10, S5E+45));

        /* photo cross-fades (wider zone for graceful blend) */
        setA(bg1.current, vh <= S1E-15 ? 1 : 1-norm(vh, S1E-15, S1E+22));
        setA(bg2.current, fadeAlpha(vh, S1E-15, S2E+22, 37));
        setA(bg3.current, fadeAlpha(vh, S2E-15, S3E+22, 37));
        setA(bg4.current, fadeAlpha(vh, S3E-15, S4E+22, 37));
        /* S5 stays visible through S6 so CTA has a dimmed hotel bg; S6 overlay provides navy tint */
        setA(bg5.current, norm(vh, S4E-15, S4E+22));

        /* ambient light gradient shift */
        if (lightRef.current) {
          const si = vh<S1E?0:vh<S2E?1:vh<S3E?2:vh<S4E?3:vh<S5E?4:5;
          lightRef.current.style.background = LIGHT_GRADS[si];
        }

        /* fade-to-navy curtain at scene boundaries */
        const CW = 20;
        let curtain = 0;
        [S1E, S2E, S3E, S4E, S5E].forEach(b => { const d=Math.abs(vh-b); if (d<CW) curtain=Math.max(curtain,1-d/CW); });
        setA(curtainRef.current, curtain);

        /* group visibility — tight, jumps hidden by curtain */
        g1.visible = vh <= S1E;
        g2.visible = vh > S1E && vh <= S2E;
        g3.visible = vh > S2E && vh <= S3E;
        g4.visible = vh > S3E && vh <= S4E;
        g5.visible = vh > S4E && vh <= S5E;
        g6.visible = vh > S5E;

        /* camera + animations */
        if (vh <= S1E) {
          const p = norm(vh, 0, S1E);
          camera.position.set(0, 0, 5 - p*7);
          camera.lookAt(0, 0, 0);

        } else if (vh <= S2E) {
          const p = norm(vh, S1E, S2E);
          /* gentle drift — photo does the work */
          camera.position.set(Math.sin(p*Math.PI*.6)*.4, .2, 4 - p*1.2);
          camera.lookAt(0, 0, -5);

        } else if (vh <= S3E) {
          const p = norm(vh, S2E, S3E);
          camera.position.set(Math.sin(p*Math.PI*.7)*3, 1.5, 7 - p*3);
          camera.lookAt(0, 0, 0);

          const a3 = fadeAlpha(vh, S2E+5, S3E-5);
          const le  = norm(p, .25, .8);
          nodeMeshes.forEach((nm, i) => {
            nm.position.lerpVectors(ZERO, nodeTargets[i], p);
            const pa = lines3[i].geometry.getAttribute('position') as THREE.BufferAttribute;
            pa.setXYZ(1, nm.position.x, nm.position.y, nm.position.z);
            pa.needsUpdate = true;
            const el = labelRefs.current[i];
            if (el) {
              const angle = (i/12)*Math.PI*2;
              const x = Math.cos(angle)*innerWidth*.28*le;
              const y = Math.sin(angle)*innerHeight*.20*le;
              el.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px))`;
              setA(el, a3*le);
            }
          });

        } else if (vh <= S4E) {
          const p = norm(vh, S3E, S4E);
          /* camera slowly drifts left→right as columns rise */
          camera.position.set(-2 + p*4, .5, 7);
          camera.lookAt(0, 0, 0);
          columns.forEach((col, i) => {
            const t  = norm(p, i*.16, 1 - i*.04);
            const y  = -20 + t*19.5;   /* rises from -20 to ~-0.5 */
            col.position.y  = y;
            discs4[i].position.y = y;
            /* ring follows top of column */
            const ring = g4.children[2 + i*4] as THREE.Mesh | undefined;
            if (ring) ring.position.y = y + 2.5;
          });

        } else if (vh <= S5E) {
          const p = norm(vh, S4E, S5E);
          camera.position.set(0, 12 - p*11, 9 - p*6);
          camera.lookAt(0, 0, 0);

        } else {
          const p = norm(vh, S5E, TOTAL);
          camera.position.set(0, 0, 5);
          camera.lookAt(0, 0, 0);
          const ba = bGeo.getAttribute('position') as THREE.BufferAttribute;
          for (let i=0;i<BN;i++) ba.setXYZ(i, bTgt[i*3]*p, bTgt[i*3+1]*p, bTgt[i*3+2]*p);
          ba.needsUpdate = true;
          const s = .01+p*1.5; orb6.scale.set(s,s,s); orb6Mat.opacity=.65*(1-p*.65);
        }
      },
    });

    /* ── RAF ───────────────────────────────────────────────────────────── */
    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      if (g1.visible) {
        g1.rotation.y = Math.sin(t*.06)*.14;
        g1.rotation.x = Math.sin(t*.04)*.06;
        connMat.opacity = .22 + Math.sin(t*1.6)*.16;
      }
      if (g2.visible) flowMat.opacity = .10 + Math.sin(t*.9)*.08;
      if (g3.visible) {
        cSphere.rotation.y += .006;
        pt3a.position.set(Math.cos(t*.5)*6, 3, Math.sin(t*.5)*6);
        pt3b.position.set(Math.cos(t*.35+Math.PI)*5, -3, Math.sin(t*.35+Math.PI)*5);
      }
      renderer.render(scene, camera);
    };
    tick();

    /* ── Resize ─────────────────────────────────────────────────────────── */
    const onResize = () => {
      camera.aspect = innerWidth/innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    /* init visible state */
    setA(o1.current, 1);
    setA(bg1.current, 1);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
      [nebGeo, connGeo, nodeGeo, dustGeo, skyGeo, techGeo, bGeo].forEach(g => g.dispose());
      renderer.dispose();
    };
  }, []);

  /* ── Shared styles ──────────────────────────────────────────────────── */
  const base: React.CSSProperties = {
    position:'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:20,
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    pointerEvents:'none', userSelect:'none', visibility:'hidden', opacity:0,
  };
  const headSty: React.CSSProperties = {
    fontFamily:'var(--font-heading,"Space Grotesk",sans-serif)',
    fontSize:'clamp(3rem,7vw,6.5rem)', fontWeight:300, lineHeight:1.0,
    letterSpacing:'-.02em', color:'#fff', margin:0,
  };
  const subSty: React.CSSProperties = {
    fontFamily:'var(--font-body,Inter,sans-serif)',
    fontSize:'clamp(.75rem,1.2vw,1rem)', letterSpacing:'.28em', color:GOLD,
    textTransform:'uppercase',
  };
  const bodySty: React.CSSProperties = {
    fontFamily:'var(--font-heading,"Space Grotesk",sans-serif)',
    fontSize:'clamp(1.2rem,2.8vw,2.2rem)', fontWeight:300,
    letterSpacing:'.03em', lineHeight:1.5, color:'#fff', textAlign:'center', maxWidth:'640px', padding:'0 2rem',
  };
  const card: React.CSSProperties = {
    background:'rgba(2,11,24,.9)', border:`1px solid rgba(0,170,255,.22)`,
    borderRadius:'6px', padding:'1.5rem', minWidth:'190px', maxWidth:'225px',
    backdropFilter:'blur(18px)', textAlign:'center',
  };

  return (
    <>
      {/* ── Photo backgrounds — z:1 ──────────────────────────────────── */}
      <div ref={bg1} style={{ position:'fixed', inset:0, zIndex:1 }}>
        <Image src={P.s1} alt="Genève" fill style={{ objectFit:'cover', objectPosition:'center 45%' }} priority />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(155deg,rgba(2,11,24,.42) 0%,rgba(2,11,24,.62) 100%)' }} />
      </div>
      <div ref={bg2} style={{ position:'fixed', inset:0, zIndex:1, visibility:'hidden', opacity:0 }}>
        <Image src={P.s2} alt="Conférence" fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(2,11,24,.68)' }} />
      </div>
      <div ref={bg3} style={{ position:'fixed', inset:0, zIndex:1, visibility:'hidden', opacity:0 }}>
        <Image src={P.s3} alt="Genève nuit" fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(2,11,24,.76)' }} />
      </div>
      <div ref={bg4} style={{ position:'fixed', inset:0, zIndex:1, visibility:'hidden', opacity:0 }}>
        <Image src={P.s4} alt="Événement" fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(2,11,24,.68)' }} />
      </div>
      <div ref={bg5} style={{ position:'fixed', inset:0, zIndex:1, visibility:'hidden', opacity:0 }}>
        <Image src={P.s5} alt="Hôtel Métropole" fill style={{ objectFit:'cover', objectPosition:'center 38%' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(2,11,24,.9) 0%,rgba(2,11,24,.48) 60%,rgba(2,11,24,.38) 100%)' }} />
      </div>

      {/* ── Three.js canvas — transparent, z:2 ───────────────────────── */}
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:2, pointerEvents:'none', display:'block' }} />

      {/* ── Ambient light ray (CSS) — z:3 ────────────────────────────── */}
      <div ref={lightRef} style={{ position:'fixed', inset:0, zIndex:3, pointerEvents:'none', transition:'background 1.4s ease' }} />

      {/* ── Top vignette — z:4 ───────────────────────────────────────── */}
      <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'32vh',
        background:'linear-gradient(to bottom,rgba(2,11,24,.55) 0%,transparent 100%)',
        zIndex:4, pointerEvents:'none' }} />

      {/* ── Floor reflection glow — z:4 ──────────────────────────────── */}
      <div style={{ position:'fixed', bottom:0, left:0, width:'100vw', height:'28vh',
        background:'linear-gradient(to top,rgba(0,80,180,.09) 0%,transparent 100%)',
        zIndex:4, pointerEvents:'none' }} />

      {/* ── S1 overlay — Hero ─────────────────────────────────────────── */}
      <div ref={o1} style={{ ...base, alignItems:'flex-start', justifyContent:'flex-end', padding:'0 clamp(2rem,7vw,8rem) clamp(6vh,10vh,12vh)' }}>
        <p style={subSty}>Genève · Septembre 2026</p>
        <h1 style={{ ...headSty, marginTop:'.8rem' }}>NeoTech<br />Forum</h1>
        <p style={{ fontFamily:'var(--font-body,Inter)', fontSize:'clamp(.88rem,1.4vw,1.05rem)', fontWeight:300, color:'rgba(255,255,255,.58)', maxWidth:'36ch', lineHeight:1.72, margin:'1.8rem 0 2.5rem' }}>
          150 décideurs. Une demi-journée pour redéfinir votre trajectoire face aux technologies qui transforment les marchés.
        </p>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', pointerEvents:'auto' }}>
          <Link href="/reserver" style={{ padding:'.88rem 2.4rem', background:GOLD, color:'#080808', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'.9rem', letterSpacing:'.06em', borderRadius:'3px', textDecoration:'none' }}>
            Réserver ma place →
          </Link>
          <Link href="/programme" style={{ padding:'.88rem 2.4rem', background:'transparent', color:'#fff', border:'1px solid rgba(255,255,255,.28)', fontFamily:'var(--font-heading)', fontWeight:400, fontSize:'.9rem', letterSpacing:'.06em', borderRadius:'3px', textDecoration:'none' }}>
            Programme
          </Link>
        </div>
      </div>

      {/* ── S2 overlay — Stats ────────────────────────────────────────── */}
      <div ref={o2} style={base}>
        <p style={{ ...bodySty, fontSize:'clamp(1.3rem,3vw,2.4rem)' }}>
          150 décideurs.<br />Une demi-journée pour<br />changer de trajectoire.
        </p>
        <div style={{ display:'flex', gap:'3.5rem', marginTop:'4rem', flexWrap:'wrap', justifyContent:'center' }}>
          {[['200','Décideurs'],['3','Experts'],['1','Journée']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <p style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(2.8rem,4.5vw,3.8rem)', fontWeight:300, color:GOLD, margin:0, lineHeight:1 }}>{n}</p>
              <p style={{ fontFamily:'var(--font-body)', fontSize:'.78rem', color:'rgba(255,255,255,.42)', letterSpacing:'.18em', textTransform:'uppercase', margin:'.6rem 0 0' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── S3 overlay — Topology ─────────────────────────────────────── */}
      <div ref={o3} style={{ ...base, justifyContent:'flex-end', paddingBottom:'9vh' }}>
        <p style={{ ...bodySty, color:CYAN, fontSize:'clamp(.9rem,2vw,1.5rem)', letterSpacing:'.1em' }}>
          Les enjeux qui redéfinissent votre secteur
        </p>
      </div>

      {/* Topic labels — radially positioned by JS */}
      {TOPICS.map((t, i) => (
        <div key={t} ref={el => { labelRefs.current[i] = el; }}
          style={{ position:'fixed', top:'50%', left:'50%', zIndex:25, visibility:'hidden', opacity:0,
            transform:'translate(-50%,-50%)', fontSize:'clamp(.58rem,.98vw,.78rem)',
            color:i%4===3?GOLD:CYAN, fontFamily:'var(--font-body,Inter)', letterSpacing:'.07em',
            whiteSpace:'nowrap', pointerEvents:'none', userSelect:'none',
            padding:'.18rem .5rem', background:'rgba(2,8,24,.84)', borderRadius:'3px',
            border:`1px solid ${i%4===3?GOLD:BLUE}38` }}
        >{t}</div>
      ))}

      {/* ── S4 overlay — Speakers ─────────────────────────────────────── */}
      <div ref={o4} style={{ ...base, justifyContent:'flex-end', paddingBottom:'10vh' }}>
        <p style={{ ...subSty, marginBottom:'2rem' }}>Les Intervenants</p>
        <div style={{ display:'flex', gap:'1.4rem', flexWrap:'wrap', justifyContent:'center', padding:'0 2rem' }}>
          {/* Card 1 */}
          <div style={card}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 1rem', position:'relative' }}>
              <Image src={P.sp1} alt="Maxime Vidal" fill style={{ objectFit:'cover' }} />
            </div>
            <p style={{ color:'#fff', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'.92rem', margin:'0 0 .3rem' }}>Maxime Vidal</p>
            <p style={{ color:CYAN, fontSize:'.72rem', margin:0, lineHeight:1.55 }}>Lead IA · Yves Saint Laurent<br />Expert VivaTech 2025 / 2026</p>
          </div>
          {/* Card 2 */}
          <div style={card}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 1rem', position:'relative' }}>
              <Image src={P.sp2} alt="Jonathan Oks" fill style={{ objectFit:'cover' }} />
            </div>
            <p style={{ color:'#fff', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'.92rem', margin:'0 0 .3rem' }}>Jonathan Oks</p>
            <p style={{ color:CYAN, fontSize:'.72rem', margin:0, lineHeight:1.55 }}>Expert Blockchain<br />&amp; Marchés Numériques</p>
          </div>
          {/* Card 3 — mystery */}
          <div style={{ ...card, border:`1px solid ${GOLD}`, boxShadow:`0 0 28px ${GOLD}18` }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:`rgba(0,170,255,.08)`, border:`1px solid ${GOLD}33`, margin:'0 auto 1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:GOLD, fontSize:'1.3rem', filter:'blur(.5px)' }}>?</span>
            </div>
            <p style={{ color:'rgba(255,255,255,.45)', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'.92rem', margin:'0 0 .3rem', filter:'blur(5px)' }}>??? ???</p>
            <p style={{ color:GOLD, fontSize:'.72rem', margin:0, lineHeight:1.55 }}>Révélé le 15 sept 2026</p>
          </div>
        </div>
      </div>

      {/* ── S5 overlay — Venue ────────────────────────────────────────── */}
      <div ref={o5} style={{ ...base, alignItems:'flex-start', justifyContent:'flex-end', padding:'0 clamp(2rem,7vw,8rem) clamp(6vh,10vh,12vh)' }}>
        <p style={subSty}>Soirée Networking</p>
        <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(2.2rem,5vw,4.5rem)', fontWeight:300, lineHeight:1.05, letterSpacing:'-.02em', color:'#fff', margin:'.8rem 0 1rem', maxWidth:'14ch' }}>
          Rooftop · Hôtel Métropole
        </h2>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(.85rem,1.3vw,.98rem)', color:'rgba(255,255,255,.48)', margin:0 }}>
          Quai Général-Guisan 34 · Genève · Vue lac Léman
        </p>
      </div>

      {/* ── S6 overlay — CTA ──────────────────────────────────────────── */}
      <div ref={o6} style={{ ...base, background:`linear-gradient(to bottom,${NAVY}e6 0%,${NAVY}f5 100%)`, pointerEvents:'auto' }}>
        <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(2.2rem,5vw,4.5rem)', fontWeight:300, lineHeight:1.05, letterSpacing:'-.02em', textAlign:'center', color:'#fff', margin:'0 0 .4rem' }}>
          Votre place. Votre réseau.
        </h2>
        <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(2.2rem,5vw,4.5rem)', fontWeight:300, lineHeight:1.05, letterSpacing:'-.02em', textAlign:'center', color:GOLD, margin:'0 0 3rem' }}>
          Votre avenir.
        </h2>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
          <Link href="/reserver" style={{ padding:'.95rem 2.6rem', background:BLUE, color:'#fff', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'.95rem', letterSpacing:'.06em', borderRadius:'3px', textDecoration:'none' }}>
            Réserver ma place →
          </Link>
          <Link href="/programme" style={{ padding:'.95rem 2.6rem', background:'transparent', color:'#fff', border:`1px solid rgba(255,255,255,.24)`, fontFamily:'var(--font-heading)', fontWeight:400, fontSize:'.95rem', letterSpacing:'.06em', borderRadius:'3px', textDecoration:'none' }}>
            Voir le programme
          </Link>
        </div>
      </div>

      {/* ── Curtain — fade to navy at scene boundaries ───────────────── */}
      <div ref={curtainRef} style={{ position:'fixed', inset:0, background:NAVY, zIndex:30, pointerEvents:'none', visibility:'hidden', opacity:0 }} />

      {/* ── 750 vh scroll spacer ──────────────────────────────────────── */}
      <div id="scroll-space" style={{ height:'750vh', position:'relative', zIndex:10 }} />
    </>
  );
}
