"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Eye, EyeOff, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Calibrated hitbox positions that wrap the mannequin parts perfectly
const HITBOXES = [
  { name: 'Head', position: [0, 1.35, 0], args: [0.45, 0.45, 0.8] },
  { name: 'Torso', position: [0, 0.45, 0], args: [0.65, 1.1, 0.8] },
  { name: 'Left Arm', position: [-0.55, 0.45, 0], args: [0.35, 0.9, 0.8] },
  { name: 'Right Arm', position: [0.55, 0.45, 0], args: [0.35, 0.9, 0.8] },
  { name: 'Left Leg', position: [-0.2, -0.7, 0], args: [0.35, 1.4, 0.8] },
  { name: 'Right Leg', position: [0.2, -0.7, 0], args: [0.35, 1.4, 0.8] },
];

function HitboxMesh({ name, position, args, isSelected, onSelect, showHelpers }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    onSelect(name);
    setTimeout(() => setClicked(false), 800);
  };

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  let opacity = 0;
  let color = '#3b82f6';

  if (clicked) {
    color = '#ef4444';
    opacity = 0.45;
  } else if (isSelected) {
    color = '#06b6d4';
    opacity = 0.25;
  } else if (hovered) {
    color = '#3b82f6';
    opacity = 0.15;
  } else if (showHelpers) {
    color = '#475569';
    opacity = 0.05;
  }

  return (
    <mesh
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <boxGeometry args={args} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
      {(showHelpers || hovered || isSelected || clicked) && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...args)]} />
          <lineBasicMaterial
            color={clicked ? '#ef4444' : isSelected ? '#06b6d4' : hovered ? '#3b82f6' : '#475569'}
            linewidth={1}
          />
        </lineSegments>
      )}
    </mesh>
  );
}

// Procedural Fallback Mannequin if GLTF is missing
function ProceduralMannequin() {
  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#475569',
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
  }, []);

  const jointMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0ea5e9',
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.8,
    });
  }, []);

  const dummyRaycast = () => {};

  return (
    <group>
      <mesh position={[0, 1.35, 0]} raycast={dummyRaycast}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <primitive object={wireframeMaterial} />
      </mesh>
      <mesh position={[0, 1.05, 0]} raycast={dummyRaycast}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <primitive object={jointMaterial} />
      </mesh>
      <mesh position={[0, 0.45, 0]} raycast={dummyRaycast}>
        <cylinderGeometry args={[0.22, 0.14, 1.0, 16]} />
        <primitive object={wireframeMaterial} />
      </mesh>
      <mesh position={[-0.32, 0.85, 0]} raycast={dummyRaycast}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <primitive object={jointMaterial} />
      </mesh>
      <mesh position={[-0.55, 0.45, 0]} raycast={dummyRaycast}>
        <cylinderGeometry args={[0.05, 0.04, 0.8, 8]} />
        <primitive object={wireframeMaterial} />
      </mesh>
      <mesh position={[0.32, 0.85, 0]} raycast={dummyRaycast}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <primitive object={jointMaterial} />
      </mesh>
      <mesh position={[0.55, 0.45, 0]} raycast={dummyRaycast}>
        <cylinderGeometry args={[0.05, 0.04, 0.8, 8]} />
        <primitive object={wireframeMaterial} />
      </mesh>
      <mesh position={[-0.15, -0.05, 0]} raycast={dummyRaycast}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <primitive object={jointMaterial} />
      </mesh>
      <mesh position={[-0.2, -0.7, 0]} raycast={dummyRaycast}>
        <cylinderGeometry args={[0.08, 0.06, 1.2, 8]} />
        <primitive object={wireframeMaterial} />
      </mesh>
      <mesh position={[0.15, -0.05, 0]} raycast={dummyRaycast}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <primitive object={jointMaterial} />
      </mesh>
      <mesh position={[0.2, -0.7, 0]} raycast={dummyRaycast}>
        <cylinderGeometry args={[0.08, 0.06, 1.2, 8]} />
        <primitive object={wireframeMaterial} />
      </mesh>
    </group>
  );
}

function GLTFModel({ url }) {
  const { scene } = useGLTF(url);

  const processedScene = useMemo(() => {
    const cloned = scene.clone();
    
    // Auto center and scale the model
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    const targetHeight = 2.5;
    const currentHeight = size.y || 1;
    const scaleFactor = targetHeight / currentHeight;
    
    cloned.scale.setScalar(scaleFactor);
    cloned.position.x = -center.x * scaleFactor;
    cloned.position.y = -center.y * scaleFactor + 0.25;
    cloned.position.z = -center.z * scaleFactor;

    // Traverse and disable raycasting on all loaded model meshes
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.raycast = () => {};
        child.material = new THREE.MeshStandardMaterial({
          color: '#306CE9',
          wireframe: true,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
        });
      }
    });

    return cloned;
  }, [scene]);

  return <primitive object={processedScene} />;
}

export default function BodySelector({ onSelect }) {
  const [selectedPart, setSelectedPart] = useState('');
  const [modelExists, setModelExists] = useState(null);
  const [showHelpers, setShowHelpers] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);

  useEffect(() => {
    fetch('/scene.gltf', { method: 'HEAD' })
      .then((res) => setModelExists(res.ok))
      .catch(() => setModelExists(false));
  }, []);

  const handleSelect = (name) => {
    setSelectedPart(name);
    if (onSelect) {
      onSelect({ point: { x: 0, y: 0, z: 0 }, partName: name });
    }
  };

  return (
    <div className="w-full h-[550px] bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl flex flex-col">
      {/* Top Banner */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block font-mono">
          3D ANATOMICAL LESION RADAR
        </span>
        <span className="text-[11px] text-slate-400">
          Click Head, Torso, Arms, or Legs to pin lesion site
        </span>
      </div>

      {/* Control Buttons Overlay */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => setShowHelpers((prev) => !prev)}
          className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
            showHelpers
              ? 'bg-blue-900/60 border-blue-500/50 text-blue-300'
              : 'bg-slate-900/80 backdrop-blur-md border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Hitbox Visual Aids"
        >
          {showHelpers ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>Hitbox Guides</span>
        </button>
        <button
          type="button"
          onClick={() => setCameraKey((k) => k + 1)}
          className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5"
          title="Reset Camera View"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Selected Location Pill */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="px-4 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Mapped:</span>
          <span className={`text-xs font-bold ${selectedPart ? 'text-cyan-400 font-mono' : 'text-slate-500'}`}>
            {selectedPart || 'Click on model'}
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          key={cameraKey}
          camera={{ position: [0, 0.5, 4], fov: 45 }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <pointLight position={[0, 1.5, 2]} intensity={0.8} color="#306CE9" />
          <pointLight position={[0, -0.5, 2]} intensity={0.6} color="#06b6d4" />

          <group position={[0, -0.2, 0]}>
            {modelExists === true ? (
              <Suspense fallback={<ProceduralMannequin />}>
                <GLTFModel url="/scene.gltf" />
              </Suspense>
            ) : (
              <ProceduralMannequin />
            )}

            {/* Overlaid Invisible Clickable Hitboxes */}
            {HITBOXES.map((hitbox) => (
              <HitboxMesh
                key={hitbox.name}
                name={hitbox.name}
                position={hitbox.position}
                args={hitbox.args}
                isSelected={selectedPart === hitbox.name}
                onSelect={handleSelect}
                showHelpers={showHelpers}
              />
            ))}
          </group>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={1.5}
            maxDistance={8}
            target={[0, 0.2, 0]}
            makeDefault
          />
        </Canvas>
      </div>
    </div>
  );
}
