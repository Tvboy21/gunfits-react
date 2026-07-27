'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useDesignStore } from '../../store/designStore';
import { BRAND_COLORS, APPAREL_SIZES, APPAREL_COLORS } from '../../utils/constants';
import { DesignElement } from '../../types';

interface LeftSidebarProps {
  product: {
    name: string;
    price: number;
    thumbnail: string;
  };
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ product }) => {
  const {
    addElement,
    selectedElementId,
    removeElement,
    elements,
    selectElement,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    activeSide,
    undo,
    redo,
    duplicateElement,
    bringToFront,
    sendToBack,
  } = useDesignStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addElement({
          type: 'image',
          x: 150,
          y: 150,
          width: 200,
          height: 200,
          rotation: 0,
          opacity: 1,
          content: event.target?.result as string,
          side: activeSide,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    addElement({
      type: 'text',
      x: 150,
      y: 150,
      width: 200,
      height: 50,
      rotation: 0,
      opacity: 1,
      content: '4LUV',
      fontSize: 48,
      fontFamily: 'Bebas Neue',
      fontColor: BRAND_COLORS.orange,
      side: activeSide,
    });
  };

  const handleAddLogo = () => {
    addElement({
      type: 'logo',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
      content: '4LUV',
      side: activeSide,
    });
  };

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-80 h-screen pt-20 overflow-y-auto flex flex-col fixed left-0 top-0 z-40 border-r"
      style={{
        backgroundColor: BRAND_COLORS.dark,
        borderColor: `${BRAND_COLORS.orange}33`,
      }}
    >
      {/* Product Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-32 object-cover rounded mb-3"
        />
        <h3 className="text-sm font-bold tracking-wide uppercase" style={{ color: BRAND_COLORS.text }}>
          {product.name}
        </h3>
        <p className="text-xs font-semibold" style={{ color: BRAND_COLORS.gold }}>
          KES {product.price?.toLocaleString()}
        </p>
      </motion.div>

      {/* Size Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: BRAND_COLORS.orange }}>
          Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {APPAREL_SIZES.map((size) => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSize(size)}
              className="py-2 text-xs font-bold rounded transition-all"
              style={{
                backgroundColor: selectedSize === size ? BRAND_COLORS.orange : `${BRAND_COLORS.orange}20`,
                color: selectedSize === size ? BRAND_COLORS.dark : BRAND_COLORS.orange,
              }}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Color Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: BRAND_COLORS.orange }}>
          Color
        </label>
        <div className="flex gap-3">
          {Object.entries(APPAREL_COLORS).map(([name, color]) => (
            <motion.button
              key={name}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedColor(color)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                backgroundColor: color,
                borderColor: selectedColor === color ? BRAND_COLORS.gold : `${BRAND_COLORS.orange}33`,
                borderWidth: selectedColor === color ? 3 : 1,
              }}
              title={name}
            />
          ))}
        </div>
      </motion.div>

      {/* Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
          Tools
        </label>
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 text-xs font-bold rounded uppercase transition-all"
            style={{
              backgroundColor: `${BRAND_COLORS.blue}20`,
              color: BRAND_COLORS.blue,
              border: `1px solid ${BRAND_COLORS.blue}`,
            }}
          >
            Upload Image
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddText}
            className="w-full py-2 px-3 text-xs font-bold rounded uppercase transition-all"
            style={{
              backgroundColor: `${BRAND_COLORS.blue}20`,
              color: BRAND_COLORS.blue,
              border: `1px solid ${BRAND_COLORS.blue}`,
            }}
          >
            Add Text
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddLogo}
            className="w-full py-2 px-3 text-xs font-bold rounded uppercase transition-all"
            style={{
              backgroundColor: `${BRAND_COLORS.blue}20`,
              color: BRAND_COLORS.blue,
              border: `1px solid ${BRAND_COLORS.blue}`,
            }}
          >
            Add Logo
          </motion.button>
        </div>
      </motion.div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
          History
        </label>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undo}
            className="flex-1 py-2 text-xs font-bold rounded uppercase transition-all"
            style={{
              backgroundColor: `${BRAND_COLORS.orange}20`,
              color: BRAND_COLORS.orange,
              border: `1px solid ${BRAND_COLORS.orange}`,
            }}
          >
            ↶ Undo
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={redo}
            className="flex-1 py-2 text-xs font-bold rounded uppercase transition-all"
            style={{
              backgroundColor: `${BRAND_COLORS.orange}20`,
              color: BRAND_COLORS.orange,
              border: `1px solid ${BRAND_COLORS.orange}`,
            }}
          >
            ↷ Redo
          </motion.button>
        </div>
      </motion.div>

      {/* Layers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 flex-1 overflow-y-auto"
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
          Layers ({elements.length})
        </label>
        <div className="space-y-2">
          {elements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => selectElement(element.id)}
              className="p-2 rounded cursor-pointer transition-all"
              style={{
                backgroundColor:
                  selectedElementId === element.id
                    ? `${BRAND_COLORS.orange}40`
                    : `${BRAND_COLORS.lightGray}40`,
                border:
                  selectedElementId === element.id
                    ? `1px solid ${BRAND_COLORS.orange}`
                    : `1px solid transparent`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-truncate" style={{ color: BRAND_COLORS.text }}>
                  {element.type === 'image' && '🖼️'}
                  {element.type === 'text' && '📝'}
                  {element.type === 'logo' && '⭐'}
                  {' '}
                  {element.content.substring(0, 20)}
                </span>
                <div className="flex gap-1">
                  {selectedElementId === element.id && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateElement(element.id);
                        }}
                        className="text-xs"
                      >
                        📋
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeElement(element.id);
                        }}
                        className="text-xs"
                      >
                        ✕
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
};
