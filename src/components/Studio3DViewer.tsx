import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Rotate3d,
  Compass,
  ExternalLink,
  Sparkles,
  Maximize2,
  RefreshCw,
  Eye,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MapPin,
  Dumbbell
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

// Verified Inside Images directly provided by Google Maps
const INSIDE_GYM_IMAGES = [
  {
    id: 'owner',
    title: 'Alwyn — Real Gym Owner & Master Trainer',
    subtitle: 'Studio Owner & Overall Management • Controls the entire gym floor and coaching standards',
    image: '/gym_images/owner_glenn_prabhu.jpg',
    mapsUrl: 'https://maps.app.goo.gl/HZBuGNpTxwbSRPfdA',
    category: 'COACH',
    badge: 'Real Gym Owner',
  },
  {
    id: 'cardio',
    title: 'Cardio & Treadmill Warm-Up Zone',
    subtitle: 'Cardiovascular stamina, treadmills and pre-workout conditioning area',
    image: '/gym_images/inside_cardio_1.jpg',
    mapsUrl: 'https://maps.app.goo.gl/VQKstSnQSjaGUDVV6',
    category: 'CARDIO',
    badge: 'Cardio Deck',
  },
  {
    id: 'dumbbell-rack',
    title: 'Heavy Dumbbell Rack & Free Weight Deck',
    subtitle: 'Full pair progression from light warm-ups to heavy dumbbell presses',
    image: '/gym_images/inside_dumbbell_rack.jpg',
    mapsUrl: 'https://maps.app.goo.gl/TsPupXzmqJKZA4YW6',
    category: 'WEIGHTS',
    badge: 'Free Weights',
  },
  {
    id: 'plate-loaded',
    title: 'Plate-Loaded Leg Press & Hack Squat Rig',
    subtitle: 'Heavy lower-body development with smooth linear bearing track',
    image: '/gym_images/inside_plate_loaded.jpg',
    mapsUrl: 'https://maps.app.goo.gl/Vo56q4dmyj74HLsN8',
    category: 'LEGS',
    badge: 'Plate Loaded',
  },
  {
    id: 'weight-training-1',
    title: 'Weight Training Bay & Multi-Pulley Cable Stations',
    subtitle: 'Versatile cable isolations for lat pulldowns, rows, and arm work',
    image: '/gym_images/inside_weight_training_1.jpg',
    mapsUrl: 'https://maps.app.goo.gl/tAp8c3os7Rjwqgnu7',
    category: 'MACHINES',
    badge: 'Cable Bay',
  },
  {
    id: 'strength-area-2',
    title: 'Heavy Strength & Conditioning Power Bay',
    subtitle: 'High density floor setup for compound lifts and barbell training',
    image: '/gym_images/inside_strength_area_2.jpg',
    mapsUrl: 'https://maps.app.goo.gl/196Jw9RdrTvPeNB27',
    category: 'STRENGTH',
    badge: 'Power Bay',
  },
  {
    id: 'cable-crossover',
    title: 'Dual Cable Crossover & Functional Rig',
    subtitle: 'Full rotational and bi-lateral cable crossover for chest and arms',
    image: '/gym_images/inside_cable_crossover.jpg',
    mapsUrl: 'https://maps.app.goo.gl/vXswoUbui8jYowMv6',
    category: 'FUNCTIONAL',
    badge: 'Crossover Rig',
  },
  {
    id: 'bench-press',
    title: 'Flat & Incline Olympic Bench Press Stations',
    subtitle: 'Heavy steel benches with safety catchers for progressive pressing',
    image: '/gym_images/inside_bench_press_stations.jpg',
    mapsUrl: 'https://maps.app.goo.gl/M2rUc86JbLPywDUZ7',
    category: 'BENCHES',
    badge: 'Olympic Benches',
  },
  {
    id: 'olympic-barbells',
    title: 'Olympic Barbells, Squat Station & Weight Trees',
    subtitle: 'Standard 20kg knurled barbells with bumper and iron plates',
    image: '/gym_images/inside_olympic_barbells.jpg',
    mapsUrl: 'https://maps.app.goo.gl/z22LKqufemnkW1B4A',
    category: 'POWERLIFTING',
    badge: 'Olympic Station',
  },
  {
    id: 'chest-press',
    title: 'Selectorized Chest Press & Machine Row Line',
    subtitle: 'Ergonomic seated machines for controlled, joint-friendly hypertrophy',
    image: '/gym_images/inside_chest_press_machines.jpg',
    mapsUrl: 'https://maps.app.goo.gl/mL8FpyTo8LRAtoSv5',
    category: 'MACHINES',
    badge: 'Pin-Loaded',
  },
  {
    id: 'floor-weights',
    title: 'Deadlift Platforms & Heavy Floor Weights',
    subtitle: 'Shock-absorbing flooring, kettlebells, and heavy cast iron disks',
    image: '/gym_images/inside_floor_weights.jpg',
    mapsUrl: 'https://maps.app.goo.gl/1nmmBAYuwsMGsSSj8',
    category: 'FLOOR',
    badge: 'Deadlift Deck',
  },
];

export const Studio3DViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'3d-streetview' | 'webgl-rig'>('3d-streetview');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [selectedInsideImage, setSelectedInsideImage] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const { openBooking } = useStudio();

  // Three.js interactive equipment scene
  useEffect(() => {
    if (activeTab !== 'webgl-rig') return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    scene.fog = new THREE.FogExp2(0x09090b, 0.05);

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.2, 2.4, 4.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 1.5;
    controls.maxDistance = 9;
    controls.target.set(0, 0.5, 0);

    const ambientLight = new THREE.HemisphereLight(0xfff0dd, 0x18181b, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(4, 6, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
    rimLight.position.set(-3.5, 2.5, -2.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 0.8, 10);
    fillLight.position.set(0, 3, -3);
    scene.add(fillLight);

    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x121214, roughness: 0.85, metalness: 0.15 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const gridHelper = new THREE.GridHelper(10, 20, 0xf59e0b, 0x27272a);
    gridHelper.position.y = 0.002;
    scene.add(gridHelper);

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe4e4e7, metalness: 0.95, roughness: 0.18 });
    const ironBlackMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, metalness: 0.6, roughness: 0.55 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });

    const gymGroup = new THREE.Group();

    // Barbell
    const barGeo = new THREE.CylinderGeometry(0.015, 0.015, 2.2, 32);
    const barMesh = new THREE.Mesh(barGeo, chromeMat);
    barMesh.rotation.z = Math.PI / 2;
    barMesh.position.set(0, 0.45, 0);
    gymGroup.add(barMesh);

    // Plates
    const plateGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 32);
    [-0.7, -0.75, 0.7, 0.75].forEach((pos) => {
      const p = new THREE.Mesh(plateGeo, ironBlackMat);
      p.rotation.z = Math.PI / 2;
      p.position.set(pos, 0.45, 0);
      gymGroup.add(p);
    });

    // Dumbbell
    const dbHandleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.3, 32);
    const dbHandle = new THREE.Mesh(dbHandleGeo, chromeMat);
    dbHandle.rotation.z = Math.PI / 2;
    dbHandle.position.set(-1.2, 0.12, 0.8);
    gymGroup.add(dbHandle);

    const dbPlateGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 32);
    [-0.14, 0.14].forEach((pos) => {
      const dbPlate = new THREE.Mesh(dbPlateGeo, goldMat);
      dbPlate.rotation.z = Math.PI / 2;
      dbPlate.position.set(-1.2 + pos, 0.12, 0.8);
      gymGroup.add(dbPlate);
    });

    // Kettlebell
    const kbBodyGeo = new THREE.SphereGeometry(0.16, 32, 32);
    const kbBody = new THREE.Mesh(kbBodyGeo, ironBlackMat);
    kbBody.position.set(1.2, 0.16, 0.8);
    gymGroup.add(kbBody);

    const kbHandleGeo = new THREE.TorusGeometry(0.1, 0.02, 16, 32, Math.PI);
    const kbHandle = new THREE.Mesh(kbHandleGeo, ironBlackMat);
    kbHandle.position.set(1.2, 0.28, 0.8);
    gymGroup.add(kbHandle);

    scene.add(gymGroup);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isAutoRotate) {
        gymGroup.rotation.y += 0.005;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeTab, isAutoRotate]);

  return (
    <section id="explore" className="py-24 bg-zinc-950 relative border-t border-zinc-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3D SHOW HEADER (In Place of Explore) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-3">
              <Rotate3d className="w-3.5 h-3.5 animate-spin-slow" />
              <span>3D Virtual Tour &amp; Walkthrough</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none">
              Explore Bounce 3D Show
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Step right inside Bounce Fitness Studio at 8QCV+WH Chikkamagaluru with our immersive Google Maps 3D Street View panorama. Look around 360&deg; to inspect the training floor, stations, and lifting bays.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('3d-streetview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === '3d-streetview'
                  ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Google Maps 360&deg; Show</span>
            </button>

            <button
              onClick={() => setActiveTab('webgl-rig')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'webgl-rig'
                  ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Interactive 3D Barbell</span>
            </button>
          </div>
        </div>

        {/* 3D SHOW VIEWPORT */}
        <div className="relative w-full h-[500px] sm:h-[600px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl mb-16">
          {activeTab === '3d-streetview' ? (
            <div className="relative w-full h-full bg-zinc-950">
              {/* Google Maps Street View 360 Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1729270000000!6m8!1m7!1s_ZJpkZIH4m6E5rfYew8k3g!2m2!1d13.3224251!2d75.7938248!3f80.929!4f-0.271!5f0.7820865974627469"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bounce Fitness Studio Google Maps 3D Virtual Show"
                className="w-full h-full filter contrast-[1.03]"
              />

              {/* Floating Overlay Badge with Direct Maps Link */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-md bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl shadow-2xl z-10">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Live 3D Photosphere View
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                    8QCV+WH
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Direct Google Maps Street View from inside Bounce Fitness Studio. Drag or swipe on mobile to rotate 360&deg; in any direction.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href="https://maps.app.goo.gl/db4f96FxvXLvNjC36"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-xs font-bold transition-all shadow-md"
                  >
                    <span>Full Google Maps 3D Experience</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    WebGL Calibrated Rig
                  </span>
                  <button
                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                    className="text-[11px] font-bold text-zinc-300 hover:text-white bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800"
                  >
                    Auto-Rotate: {isAutoRotate ? 'ON' : 'OFF'}
                  </button>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Drag to orbit 360&deg; &bull; Scroll to zoom &bull; PBR tone-mapped Olympic bar, cast iron weights &amp; kettlebells.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* WHOLE GYM FROM INSIDE (Required Google Maps Photos) */}
        <div id="inside-gym" className="pt-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-3">
              <Eye className="w-3.5 h-3.5" />
              <span>Full Inside Gym Tour</span>
            </div>
            <h3 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-none mb-3">
              Showing The Whole Gym From Inside
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base">
              Every area, machine bay, lifting deck, and real gym owner Alwyn with head coach Glenn Prabhu &amp; Firoz captured directly on Google Maps. Click any photo to inspect up close.
            </p>
          </div>

          {/* Inside Photo Grid (All 11 verified photos included without exception) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {INSIDE_GYM_IMAGES.map((item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedInsideImage(index);
                  setZoomed(false);
                }}
                className={`group relative rounded-2xl overflow-hidden bg-zinc-900 border transition-all duration-300 cursor-pointer shadow-xl ${
                  item.category === 'COACH'
                    ? 'border-amber-500/80 ring-2 ring-amber-500/20 sm:col-span-2 md:col-span-1 lg:col-span-2 h-80'
                    : 'border-zinc-800 hover:border-amber-500/60 h-72'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                {/* Badges & Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-zinc-950 shadow-md">
                      {item.badge}
                    </span>
                    <a
                      href={item.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-zinc-950/80 text-zinc-300 hover:text-amber-400 border border-zinc-800 hover:border-amber-500/50 backdrop-blur-sm"
                      title="View Photo on Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-white leading-snug mb-1 group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Google Maps Verified
                      </span>
                      <span className="text-amber-400 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        Inspect &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High Definition Inside Lightbox Modal */}
      {selectedInsideImage !== null && INSIDE_GYM_IMAGES[selectedInsideImage] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                {INSIDE_GYM_IMAGES[selectedInsideImage].badge}
              </span>
              <span className="text-zinc-500">&bull;</span>
              <span className="text-sm font-semibold text-white">
                {selectedInsideImage + 1} of {INSIDE_GYM_IMAGES.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={INSIDE_GYM_IMAGES[selectedInsideImage].mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
              <button
                onClick={() => setZoomed(!zoomed)}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
              >
                {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setSelectedInsideImage(null)}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Photo */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            <button
              onClick={() => {
                setZoomed(false);
                setSelectedInsideImage((selectedInsideImage - 1 + INSIDE_GYM_IMAGES.length) % INSIDE_GYM_IMAGES.length);
              }}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-zinc-900/80 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-700/60 transition-all cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center p-2">
              <img
                src={INSIDE_GYM_IMAGES[selectedInsideImage].image}
                alt={INSIDE_GYM_IMAGES[selectedInsideImage].title}
                className={`max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-transform duration-300 ${
                  zoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setZoomed(!zoomed)}
              />
            </div>

            <button
              onClick={() => {
                setZoomed(false);
                setSelectedInsideImage((selectedInsideImage + 1) % INSIDE_GYM_IMAGES.length);
              }}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-zinc-900/80 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-700/60 transition-all cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption */}
          <div className="text-center z-10 pb-2 max-w-2xl mx-auto">
            <h4 className="text-base sm:text-xl font-display uppercase tracking-wider text-white">
              {INSIDE_GYM_IMAGES[selectedInsideImage].title}
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              {INSIDE_GYM_IMAGES[selectedInsideImage].subtitle}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
