import React, { useEffect, useState } from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import state from '../store';

const Shirt = () => {
  const snap = useSnapshot(state);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  
  // Load the GLTF model with error handling
  const { nodes, materials } = useGLTF('/shirt_baked.glb');
  
  // Load textures properly with error handling
  const logoTexture = useTexture(snap.logoDecal, (texture) => {
    // Handle successful texture loading
    texture.needsUpdate = true;
  }, (error) => {
    console.error('Error loading logo texture:', error);
  });
  
  const fullTexture = useTexture(snap.fullDecal, (texture) => {
    // Handle successful texture loading
    texture.needsUpdate = true;
  }, (error) => {
    console.error('Error loading full texture:', error);
  });
  
  // Set up texture properties after loading
  useEffect(() => {
    if (logoTexture && fullTexture) {
      // Always ensure logo textures have consistent orientation
      logoTexture.flipY = false;
      
      // Fix full texture fitting
      fullTexture.flipY = false;
      fullTexture.repeat.set(1, 1); // Ensure proper repeat
      fullTexture.wrapS = fullTexture.wrapT = THREE.RepeatWrapping; // Enable wrapping
      
      // Mark textures as loaded
      setTexturesLoaded(true);
    }
  }, [logoTexture, fullTexture]);

  // Smoothly update the shirt color
  useFrame((state, delta) => {
    if (materials && materials.lambert1) {
      easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
    }
  });

  const stateString = JSON.stringify(snap);

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {texturesLoaded && snap.isFullTexture && fullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            // Adjust scale to better fit the shirt model
            scale={[1, 1, 1]}
            map={fullTexture}
            // Better texture mapping for full shirt coverage
            mapAnisotropy={8}
            // Blend mode for better visual integration
            transparent={true}
            depthTest={true}
            depthWrite={false}
            polygonOffset={true}
            polygonOffsetFactor={-4}
          />
        )}

        {texturesLoaded && snap.isLogoTexture && logoTexture && (
          <Decal 
            key={`logo-${snap.logoDecal}-${snap.isNewUpload}`} // Force remount when logo changes
            position={[0, 0.04, 0.15]}
            // Use the correct rotation to display the logo properly
            rotation={[0, 0, 0]}
            // Adjusted scale for better logo appearance
            scale={0.15}
            map={logoTexture}
            // Better texture properties for logo
            transparent={true}
            depthTest={false}
            depthWrite={true}
            // Ensure logo appears on top of other textures
            polygonOffset={true}
            polygonOffsetFactor={-4}
          />
        )}
      </mesh>
    </group>
  )
}

export default Shirt