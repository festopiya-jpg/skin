"use client";

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFBX, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Heuristic function to determine body part based on coordinates
// These thresholds will likely need tuning based on the specific model's scale and orientation
function getBodyPartName(point) {
  const { x, y, z } = point;
  
  // The model is scaled to 0.015 and positioned at y=-1
  // Feet are near y=-1, Head is near y=1.5
  if (y > 1.2) return 'Head';
  if (y > 0.5) {
    if (x > 0.2) return 'Left Arm';
    if (x < -0.2) return 'Right Arm';
    return 'Chest / Upper Back';
  }
  if (y > 0.0) {
    if (x > 0.3) return 'Left Hand / Forearm';
    if (x < -0.3) return 'Right Hand / Forearm';
    return 'Abdomen / Lower Back';
  }
  if (y > -0.6) {
    if (x > 0.1) return 'Left Thigh';
    if (x < -0.1) return 'Right Thigh';
    return 'Pelvis';
  }
  
  if (x > 0.08) return 'Left Calf / Foot';
  if (x < -0.08) return 'Right Calf / Foot';
  return 'Lower Body';
}

function Model({ onBodyClick }) {
  // Load the FBX model
  const fbx = useFBX('/models/Ezren_SimpleHumanBody.fbx');
  
  // Clone to avoid mutating the cached object if used multiple times
  const clonedScene = React.useMemo(() => fbx.clone(), [fbx]);
  
  // Add a material if the model looks unshaded (sometimes FBX lacks materials)
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ 
          color: '#e5e7eb', // Light gray
          roughness: 0.7,
          metalness: 0.1
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  // Adjust scale if necessary depending on the FBX export scale
  // FBX from Maya/Max might be 100x larger
  React.useEffect(() => {
    clonedScene.scale.set(0.015, 0.015, 0.015);
  }, [clonedScene]);

  return (
    <primitive 
      object={clonedScene} 
      onClick={(e) => {
        // Stop propagation so it doesn't click multiple underlying meshes
        e.stopPropagation();
        onBodyClick(e.point);
      }}
      position={[0, -1, 0]} // shift down a bit if origin is at feet
    />
  );
}

export default function BodySelector({ onSelect }) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedPart, setSelectedPart] = useState('');

  const handleBodyClick = (point) => {
    setSelectedPoint(point);
    const partName = getBodyPartName(point);
    setSelectedPart(partName);
    if (onSelect) {
      onSelect({ point, partName });
    }
  };

  return (
    <div className="w-full h-[600px] bg-transparent rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Model onBodyClick={handleBodyClick} />
          
          {/* Visual Pin Marker */}
          {selectedPoint && (
            <mesh position={[selectedPoint.x, selectedPoint.y, selectedPoint.z]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
            </mesh>
          )}
          
          <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          minDistance={2}
          maxDistance={30}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          target={[0, 0.5, 0]}
        />
      </Canvas>
      
      {/* Helper text overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 shadow-sm pointer-events-none border border-slate-700">
        Drag to rotate • Scroll to zoom
      </div>
      
      {selectedPart && (
        <div className="absolute bottom-4 left-4 bg-sky-500/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg pointer-events-none">
          Selected: {selectedPart}
        </div>
      )}
    </div>
  );
}
