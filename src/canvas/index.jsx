import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center, useGLTF } from '@react-three/drei';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

// Preload the 3D model to avoid loading issues
useGLTF.preload('/shirt_baked.glb');

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Canvas error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-center">Something went wrong with the 3D viewer. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

const CanvasModel = () => {
  return (
    <ErrorBoundary>
      <Canvas
        shadows
        camera={{ position: [0, 0, 0], fov: 30 }}
        gl={{
          preserveDrawingBuffer: true,
          // Add powerPreference setting for better performance
          powerPreference: 'high-performance',
          // Increase precision to avoid rendering issues
          precision: 'highp',
          // Ensure proper stencil buffer
          stencil: true,
          // Enable antialias for smoother edges
          antialias: true
        }}
        className='w-full max-w-full h-full transition-all ease-in'
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Environment preset="city" />

          <CameraRig>
            <Backdrop />
            <Center>
              <Shirt />
            </Center>
          </CameraRig>
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
};

export default CanvasModel;