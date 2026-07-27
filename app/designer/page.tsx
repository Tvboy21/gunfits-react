'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useDesignStore } from './store/designStore';
import { useKeyboardShortcuts, useAutoSave } from './hooks';
import { Header } from './components/Header';
import { LeftSidebar } from './components/Sidebar/LeftSidebar';
import { RightSidebar } from './components/Sidebar/RightSidebar';
import { TabNavigation } from './components/Navigation';
import { DesignerStyles } from './styles';
import { BRAND_COLORS } from './utils/constants';
import { exportDesignAsPNG } from './utils/helpers';

// Dynamic imports for components that use browser-only libraries
const CanvasEditor = dynamic(() => import('./components/Canvas/CanvasEditor').then(mod => ({ default: mod.CanvasEditor })), {
  loading: () => <div style={{ color: BRAND_COLORS.text }}>Loading canvas...</div>,
  ssr: false,
});

const ProductPreviewPanel = dynamic(
  () => import('./components/Preview/ThreePreview').then(mod => ({ default: mod.ProductPreviewPanel })),
  { loading: () => <div style={{ color: BRAND_COLORS.text }}>Loading 3D preview...</div>, ssr: false }
);

interface DesignerPageProps {
  productId?: string;
}

export function DesignerPageContent({ productId = 'tshirt-001' }: DesignerPageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'3d' | '2d'>('3d');
  const [designUrl, setDesignUrl] = useState('');

  // Load hooks
  useKeyboardShortcuts();
  useAutoSave(30000); // Auto-save every 30 seconds

  const {
    loadDesign,
    saveDesign,
    activeSide,
    setActiveSide,
    elements,
    selectedColor,
    selectedSize,
    isDirty,
  } = useDesignStore();

  // Load design on mount
  useEffect(() => {
    loadDesign();
  }, []);

  // Mock product data - replace with real data from props
  const product = {
    id: productId,
    name: '4LUV Premium T-Shirt',
    price: 3500,
    thumbnail:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
  };

  const handleAddToCart = () => {
    saveDesign();
    alert('Design added to cart!');
  };

  const handleBuyNow = () => {
    saveDesign();
    alert('Redirecting to checkout...');
  };

  const handlePreview = () => {
    const nextShow = !showPreview;
    setShowPreview(nextShow);
    if (nextShow && stageRef.current) {
      const canvas = stageRef.current.querySelector('canvas');
      if (canvas && canvas instanceof HTMLCanvasElement) {
        try {
          setDesignUrl(canvas.toDataURL('image/png'));
        } catch (e) {
          console.error('Failed to generate preview:', e);
        }
      }
    }
  };

  const handleExport = () => {
    if (stageRef.current) {
      const canvas = stageRef.current.querySelector('canvas');
      if (canvas && canvas instanceof HTMLCanvasElement) {
        exportDesignAsPNG(canvas, `4luv-design-${Date.now()}.png`);
      }
    }
  };

  return (
    <div
      className="w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: BRAND_COLORS.dark }}
    >
      {/* Animated background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, ${BRAND_COLORS.maroon}15 1px, transparent 1px),
            linear-gradient(90deg, ${BRAND_COLORS.orange}08 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          zIndex: 1,
        }}
      />

      {/* Header */}
      <Header
        productName={product.name}
        productPrice={product.price}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onPreview={handlePreview}
      />

      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Left Sidebar */}
        <LeftSidebar product={product} />

        {/* Center Canvas */}
        <div className="flex-1 ml-80 mr-72 relative" ref={stageRef}>
          {/* Side Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 flex gap-2"
          >
            {['front', 'back', 'sleeve'].map((side) => (
              <motion.button
                key={side}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSide(side as 'front' | 'back' | 'sleeve')}
                className="px-4 py-2 text-xs font-bold uppercase rounded transition-all"
                style={{
                  backgroundColor:
                    activeSide === side
                      ? BRAND_COLORS.orange
                      : `${BRAND_COLORS.orange}20`,
                  color:
                    activeSide === side ? BRAND_COLORS.dark : BRAND_COLORS.orange,
                  border:
                    activeSide === side
                      ? `2px solid ${BRAND_COLORS.gold}`
                      : `1px solid ${BRAND_COLORS.orange}`,
                }}
              >
                {side}
              </motion.button>
            ))}
          </motion.div>

          {/* Canvas */}
          <CanvasEditor activeSide={activeSide} />
        </div>

        {/* Right Sidebar */}
        <RightSidebar onExport={handleExport} />
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPreview(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: `${BRAND_COLORS.dark}E6` }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-dark p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: BRAND_COLORS.dark }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold uppercase tracking-widest"
                style={{ color: BRAND_COLORS.orange }}
              >
                Design Preview
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreview(false)}
                className="text-2xl font-bold"
                style={{ color: BRAND_COLORS.text }}
              >
                ✕
              </motion.button>
            </div>

            <div className="mb-6">
              <div className="flex gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreviewMode('3d')}
                  className="px-4 py-2 text-xs font-bold uppercase rounded"
                  style={{
                    backgroundColor:
                      previewMode === '3d'
                        ? BRAND_COLORS.blue
                        : `${BRAND_COLORS.blue}20`,
                    color:
                      previewMode === '3d'
                        ? BRAND_COLORS.dark
                        : BRAND_COLORS.blue,
                  }}
                >
                  3D View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreviewMode('2d')}
                  className="px-4 py-2 text-xs font-bold uppercase rounded"
                  style={{
                    backgroundColor:
                      previewMode === '2d'
                        ? BRAND_COLORS.blue
                        : `${BRAND_COLORS.blue}20`,
                    color:
                      previewMode === '2d'
                        ? BRAND_COLORS.dark
                        : BRAND_COLORS.blue,
                  }}
                >
                  2D View
                </motion.button>
              </div>

              {previewMode === '3d' && (
                <ProductPreviewPanel
                  product={product}
                  design={designUrl}
                  color={selectedColor}
                  side={activeSide}
                />
              )}

              {previewMode === '2d' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 rounded-lg"
                  style={{
                    backgroundColor: `${BRAND_COLORS.gray}80`,
                    border: `1px solid ${BRAND_COLORS.orange}33`,
                  }}
                >
                  <div
                    className="aspect-square rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: BRAND_COLORS.gray,
                      border: `2px solid ${BRAND_COLORS.orange}33`,
                    }}
                  >
                    {designUrl && (
                      <img
                        src={designUrl}
                        alt="Design Preview"
                        className="w-full h-full object-contain p-4"
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex-1 py-3 text-sm font-bold uppercase rounded"
                style={{
                  backgroundColor: BRAND_COLORS.orange,
                  color: BRAND_COLORS.dark,
                }}
              >
                Export Design
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 py-3 text-sm font-bold uppercase rounded"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_COLORS.orange}, ${BRAND_COLORS.gold})`,
                  color: BRAND_COLORS.dark,
                }}
              >
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Dirty indicator */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-4 right-4 text-xs font-semibold"
          style={{ color: BRAND_COLORS.gold }}
        >
          ● Unsaved changes
        </motion.div>
      )}
    </div>
  );
}

export default function DesignerPage(props: DesignerPageProps) {
  return (
    <>
      <DesignerStyles />
      <DesignerPageContent {...props} />
    </>
  );
}
