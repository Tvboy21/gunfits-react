'use client';

import React, { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Plane, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { BRAND_COLORS } from '../../utils/constants';

interface ThreePreviewProps {
  design: string;
  color: string;
  side: 'front' | 'back' | 'sleeve';
}

// Separate component so useTexture is called at the top level of a React
// component and never inside a try/catch (which violates React hooks rules).
const DesignTexture: React.FC<{ designUrl: string }> = ({ designUrl }) => {
  const texture = useTexture(designUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh position={[0, 0.2, 0.16]}>
      <planeGeometry args={[1.2, 1.5]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  );
};

const Tshirt: React.FC<{ color: string; designUrl: string; side: string }> = ({
  color,
  designUrl,
  side,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      {/* Main body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.5, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Front design */}
      {side === 'front' && designUrl && <DesignTexture designUrl={designUrl} />}

      {/* Sleeves */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[1.2, 0, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  );
};

const PreviewScene: React.FC<{ color: string; designUrl: string; side: string }> = ({
  color,
  designUrl,
  side,
}) => {
  const { camera } = useThree();
  camera.position.z = 3;

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#fff" />
      <pointLight position={[-10, 10, 10]} intensity={0.4} color={BRAND_COLORS.blue} />
      <Tshirt color={color} designUrl={designUrl} side={side} />
      <OrbitControls autoRotate autoRotateSpeed={4} />
    </>
  );
};

export const ThreePreview: React.FC<ThreePreviewProps> = ({ design, color, side }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-96 rounded-lg overflow-hidden"
      style={{
        backgroundColor: BRAND_COLORS.gray,
        border: `2px solid ${BRAND_COLORS.orange}33`,
        boxShadow: `0 0 30px ${BRAND_COLORS.maroon}40`,
      }}
    >
      <Canvas>
        <PreviewScene color={color} designUrl={design} side={side} />
      </Canvas>
    </motion.div>
  );
};

export const ProductPreviewPanel: React.FC<{
  product: {
    name: string;
    price: number;
  };
  design: string;
  color: string;
  side: 'front' | 'back' | 'sleeve';
}> = ({ product, design, color, side }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-lg"
      style={{
        backgroundColor: `${BRAND_COLORS.gray}80`,
        border: `1px solid ${BRAND_COLORS.orange}33`,
      }}
    >
      <h3 className="text-lg font-bold mb-4 uppercase tracking-widest" style={{ color: BRAND_COLORS.text }}>
        Live Preview
      </h3>

      <ThreePreview design={design} color={color} side={side} />

      <div className="mt-4 space-y-2">
        <p className="text-sm font-semibold" style={{ color: BRAND_COLORS.text }}>
          {product.name}
        </p>
        <p className="text-xs" style={{ color: BRAND_COLORS.gold }}>
          KES {product.price?.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};
