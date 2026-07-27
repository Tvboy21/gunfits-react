'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useDesignStore } from '../store/designStore';
import { BRAND_COLORS, ANIMATION_DURATION } from '../utils/constants';

interface HeaderProps {
  productName: string;
  productPrice: number;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onPreview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  productName,
  productPrice,
  onAddToCart,
  onBuyNow,
  onPreview,
}) => {
  const { saveDesign } = useDesignStore();

  const handleSave = () => {
    saveDesign();
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        backgroundColor: BRAND_COLORS.dark,
        borderColor: `${BRAND_COLORS.orange}33`,
      }}
    >
      <div className="px-6 py-4 flex items-center justify-between max-w-full">
        {/* Left: Logo & Product Info */}
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <h1
              className="text-2xl font-black tracking-widest"
              style={{ color: BRAND_COLORS.orange }}
            >
              4LUV
            </h1>
          </motion.div>

          <div className="hidden md:block border-l" style={{ borderColor: BRAND_COLORS.orange }}>
            <p
              className="ml-6 text-sm font-bold tracking-wide uppercase"
              style={{ color: BRAND_COLORS.text }}
            >
              {productName}
            </p>
            <p
              className="ml-6 text-xs font-semibold"
              style={{ color: BRAND_COLORS.gold }}
            >
              KES {productPrice?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Center: Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:block text-center"
        >
          <h2
            className="text-lg font-black tracking-widest uppercase"
            style={{ color: BRAND_COLORS.blue }}
          >
            Designer
          </h2>
        </motion.div>

        {/* Right: Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 md:gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-bold uppercase rounded transition-all"
            style={{
              backgroundColor: `${BRAND_COLORS.orange}20`,
              color: BRAND_COLORS.orange,
              border: `1px solid ${BRAND_COLORS.orange}`,
            }}
          >
            Save
          </motion.button>

          {onPreview && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPreview}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-bold uppercase rounded hidden sm:block"
              style={{
                backgroundColor: `${BRAND_COLORS.blue}20`,
                color: BRAND_COLORS.blue,
                border: `1px solid ${BRAND_COLORS.blue}`,
              }}
            >
              Preview
            </motion.button>
          )}

          {onAddToCart && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddToCart}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-bold uppercase rounded"
              style={{
                backgroundColor: BRAND_COLORS.orange,
                color: BRAND_COLORS.dark,
              }}
            >
              Add to Cart
            </motion.button>
          )}

          {onBuyNow && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBuyNow}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-bold uppercase rounded"
              style={{
                background: `linear-gradient(135deg, ${BRAND_COLORS.orange}, ${BRAND_COLORS.gold})`,
                color: BRAND_COLORS.dark,
              }}
            >
              Buy Now
            </motion.button>
          )}
        </motion.div>
      </div>
    </header>
  );
};
