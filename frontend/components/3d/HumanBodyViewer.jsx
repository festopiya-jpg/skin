'use client';

import React, { useRef, useState, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="flex flex-col items-center text-center p-4 bg-white/90 rounded-xl border border-rose-500/30 min-w-[250px]">
            <AlertCircle className="w-8 h-8 text-rose-600 mb-2" />
            <p className="text-gray-900 text-sm font-medium">3D Model Not Found</p>
            <p className="text-gray-500 text-xs mt-1">Please add human_body.gltf</p>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

function Model({ url, onPartClick }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  const handleClick = (event) => {
    event.stopPropagation();
    const partName = event.object.name || 'Unknown Part';
    const point = event.point;
    onPartClick(partName, point);
  };

  return (
    <primitive 
      object={scene} 
      ref={modelRef}
      onClick={handleClick}
      scale={1.5}
      position={[0, -1.5, 0]}
    />
  );
}

export default function HumanBodyViewer() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [annotations, setAnnotations] = useState([]);

  const handlePartClick = (partName, point) => {
    setSelectedPart(partName);
    setAnnotations([...annotations, { partName, point }]);
  };

  return (
    <div className="w-full h-[600px] relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex items-center justify-center">
      <div className="absolute top-4 left-4 z-10 bg-black/60 p-4 rounded-lg backdrop-blur-md text-gray-900">
        <h3 className="text-xl font-bold mb-2">3D Patient Visualization</h3>
        <p className="text-sm text-gray-300">Click on the model to map lesions.</p>
        {selectedPart && (
          <p className="mt-2 text-green-400 font-semibold">
            Selected: {selectedPart}
          </p>
        )}
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <ErrorBoundary>
          <React.Suspense fallback={<Html center><div className="text-gray-900">Loading 3D Model...</div></Html>}>
            <Model url="/models/human_body.gltf" onPartClick={handlePartClick} />
          </React.Suspense>
        </ErrorBoundary>
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
