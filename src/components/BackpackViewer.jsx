import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import styled from 'styled-components';
import * as THREE from 'three';

// Styled components
const ViewerContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 400px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Loading component
const Loader = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" />
  </mesh>
);

// 3D Model component
function BackpackModel({ config }) {
  const group = useRef();
  const { scene } = useGLTF('/models/backpack.glb');

  useEffect(() => {
    if (!scene) return;

    // Create materials
    const createMaterial = (type) => {
      const material = new THREE.MeshStandardMaterial();
      
      // Load textures
      const textureLoader = new THREE.TextureLoader();
      
      // Base color texture
      const baseColorTexture = textureLoader.load(`/textures/${type}_baseColor.jpg`);
      baseColorTexture.wrapS = baseColorTexture.wrapT = THREE.RepeatWrapping;
      material.map = baseColorTexture;

      // Normal texture
      const normalTexture = textureLoader.load(`/textures/${type}_normal.jpg`);
      normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
      material.normalMap = normalTexture;
      material.normalScale.set(1, 1);

      // ORM texture
      const ormTexture = textureLoader.load(`/textures/${type}_occlusionRoughnessMetallic.jpg`);
      ormTexture.wrapS = ormTexture.wrapT = THREE.RepeatWrapping;
      
      // Set material properties
      material.metalness = 0.5;
      material.roughness = 0.5;

      // Apply color
      const colorMap = {
        brown: '#8B4513',
        black: '#000000',
        darkblue: '#00008B'
      };
      material.color.set(colorMap[config.color]);

      return material;
    };

    // Create hardware material
    const createHardwareMaterial = () => {
      const material = new THREE.MeshStandardMaterial();
      
      const textureLoader = new THREE.TextureLoader();
      
      const baseColorTexture = textureLoader.load('/textures/metall_baseColor.jpg');
      baseColorTexture.wrapS = baseColorTexture.wrapT = THREE.RepeatWrapping;
      material.map = baseColorTexture;

      const normalTexture = textureLoader.load('/textures/metall_normal.jpg');
      normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
      material.normalMap = normalTexture;
      material.normalScale.set(1, 1);

      // Set hardware color based on config
      const hardwareColorMap = {
        silver: '#C0C0C0',
        black: '#000000',
        gold: '#FFD700'
      };
      material.color.set(hardwareColorMap[config.hardware]);
      material.metalness = 0.8;
      material.roughness = 0.2;

      return material;
    };

    // Apply materials to meshes
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.name === 'Mesh_1') {
          child.material = createHardwareMaterial();
        } else {
          child.material = createMaterial(config.material);
        }
      }
    });
  }, [scene, config.material, config.color, config.hardware]);

  return (
    <group ref={group} position={[0, -0.25, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function BackpackViewer({ config }) {
  return (
    <ViewerContainer>
      <Canvas camera={{ position: [0, 1, 5], fov: 10 }}>
        <Suspense fallback={<Loader />}>
          {/* Ambient light for overall illumination */}
          <ambientLight intensity={2} />
          
          {/* Main directional light */}
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1} 
            castShadow
          />
          
          {/* Fill light from the opposite side */}
          <directionalLight 
            position={[-5, 5, -5]} 
            intensity={0.5} 
          />
          
          {/* Rim light */}
          <directionalLight 
            position={[0, 5, -5]} 
            intensity={0.3} 
          />
          
          <BackpackModel config={config} />
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
          />
        </Suspense>
      </Canvas>
    </ViewerContainer>
  );
}

export default BackpackViewer; 