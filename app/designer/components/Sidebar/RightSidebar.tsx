'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useDesignStore } from '../../store/designStore';
import { BRAND_COLORS, FONTS } from '../../utils/constants';
import { DesignElement } from '../../types';

interface RightSidebarProps {
  onExport?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onExport }) => {
  const {
    elements,
    selectedElementId,
    updateElement,
    zoomLevel,
    setZoom,
    bringToFront,
    sendToBack,
  } = useDesignStore();

  const selectedElement = elements.find((el) => el.id === selectedElementId) as DesignElement | undefined;

  if (!selectedElement) {
    return (
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-72 h-screen pt-20 overflow-y-auto flex flex-col fixed right-0 top-0 z-40 border-l"
        style={{
          backgroundColor: BRAND_COLORS.dark,
          borderColor: `${BRAND_COLORS.orange}33`,
        }}
      >
        <div className="p-4 text-center" style={{ color: BRAND_COLORS.text }}>
          <p className="text-sm font-semibold">Select an element to edit</p>
        </div>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-72 h-screen pt-20 overflow-y-auto flex flex-col fixed right-0 top-0 z-40 border-l"
      style={{
        backgroundColor: BRAND_COLORS.dark,
        borderColor: `${BRAND_COLORS.orange}33`,
      }}
    >
      {/* Element Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: BRAND_COLORS.orange }}>
          Element Type
        </label>
        <p className="text-sm capitalize" style={{ color: BRAND_COLORS.text }}>
          {selectedElement.type}
        </p>
      </motion.div>

      {/* Position */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
          Position
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: BRAND_COLORS.text }}>
              X
            </label>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
              className="w-full px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: BRAND_COLORS.lightGray,
                color: BRAND_COLORS.text,
                border: `1px solid ${BRAND_COLORS.orange}`,
              }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: BRAND_COLORS.text }}>
              Y
            </label>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
              className="w-full px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: BRAND_COLORS.lightGray,
                color: BRAND_COLORS.text,
                border: `1px solid ${BRAND_COLORS.orange}`,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Size */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
          Size
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: BRAND_COLORS.text }}>
              W
            </label>
            <input
              type="number"
              value={Math.round(selectedElement.width)}
              onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })}
              className="w-full px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: BRAND_COLORS.lightGray,
                color: BRAND_COLORS.text,
                border: `1px solid ${BRAND_COLORS.orange}`,
              }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: BRAND_COLORS.text }}>
              H
            </label>
            <input
              type="number"
              value={Math.round(selectedElement.height)}
              onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) })}
              className="w-full px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: BRAND_COLORS.lightGray,
                color: BRAND_COLORS.text,
                border: `1px solid ${BRAND_COLORS.orange}`,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Rotation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
          Rotation
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={selectedElement.rotation}
          onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
          className="w-full"
        />
        <p className="text-xs mt-1" style={{ color: BRAND_COLORS.text }}>
          {Math.round(selectedElement.rotation)}°
        </p>
      </motion.div>

      {/* Opacity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
          Opacity
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={selectedElement.opacity}
          onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
          className="w-full"
        />
        <p className="text-xs mt-1" style={{ color: BRAND_COLORS.text }}>
          {Math.round(selectedElement.opacity * 100)}%
        </p>
      </motion.div>

      {/* Text Properties */}
      {selectedElement.type === 'text' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-4 border-b"
          style={{ borderColor: `${BRAND_COLORS.orange}33` }}
        >
          <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
            Text
          </label>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: BRAND_COLORS.text }}>
                Content
              </label>
              <input
                type="text"
                value={selectedElement.content}
                onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                className="w-full px-2 py-1 text-xs rounded"
                style={{
                  backgroundColor: BRAND_COLORS.lightGray,
                  color: BRAND_COLORS.text,
                  border: `1px solid ${BRAND_COLORS.orange}`,
                }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: BRAND_COLORS.text }}>
                Font Size
              </label>
              <input
                type="number"
                value={selectedElement.fontSize || 24}
                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                className="w-full px-2 py-1 text-xs rounded"
                style={{
                  backgroundColor: BRAND_COLORS.lightGray,
                  color: BRAND_COLORS.text,
                  border: `1px solid ${BRAND_COLORS.orange}`,
                }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: BRAND_COLORS.text }}>
                Font Family
              </label>
              <select
                value={selectedElement.fontFamily || 'Arial'}
                onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                className="w-full px-2 py-1 text-xs rounded"
                style={{
                  backgroundColor: BRAND_COLORS.lightGray,
                  color: BRAND_COLORS.text,
                  border: `1px solid ${BRAND_COLORS.orange}`,
                }}
              >
                {FONTS.map((font) => (
                  <option key={font} value={font} style={{ backgroundColor: BRAND_COLORS.lightGray }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: BRAND_COLORS.text }}>
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.fontColor || BRAND_COLORS.text}
                  onChange={(e) => updateElement(selectedElement.id, { fontColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 p-0"
                  style={{ cursor: 'pointer' }}
                />
                <span className="text-xs" style={{ color: BRAND_COLORS.text }}>
                  {selectedElement.fontColor || BRAND_COLORS.text}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stacking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
          Stacking
        </label>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => bringToFront(selectedElement.id)}
            className="flex-1 py-2 text-xs font-bold rounded uppercase"
            style={{
              backgroundColor: `${BRAND_COLORS.blue}20`,
              color: BRAND_COLORS.blue,
              border: `1px solid ${BRAND_COLORS.blue}`,
            }}
          >
            Front
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendToBack(selectedElement.id)}
            className="flex-1 py-2 text-xs font-bold rounded uppercase"
            style={{
              backgroundColor: `${BRAND_COLORS.blue}20`,
              color: BRAND_COLORS.blue,
              border: `1px solid ${BRAND_COLORS.blue}`,
            }}
          >
            Back
          </motion.button>
        </div>
      </motion.div>

      {/* Zoom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-4 border-b"
        style={{ borderColor: `${BRAND_COLORS.orange}33` }}
      >
        <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: BRAND_COLORS.orange }}>
          Zoom
        </label>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setZoom(Math.max(0.5, zoomLevel - 0.1))}
            className="px-2 py-1 text-xs font-bold rounded"
            style={{
              backgroundColor: `${BRAND_COLORS.orange}20`,
              color: BRAND_COLORS.orange,
              border: `1px solid ${BRAND_COLORS.orange}`,
            }}
          >
            −
          </motion.button>
          <span className="text-xs font-semibold flex-1 text-center" style={{ color: BRAND_COLORS.text }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setZoom(Math.min(2, zoomLevel + 0.1))}
            className="px-2 py-1 text-xs font-bold rounded"
            style={{
              backgroundColor: `${BRAND_COLORS.orange}20`,
              color: BRAND_COLORS.orange,
              border: `1px solid ${BRAND_COLORS.orange}`,
            }}
          >
            +
          </motion.button>
        </div>
      </motion.div>

      {/* Export */}
      {onExport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExport}
            className="w-full py-2 px-3 text-xs font-bold rounded uppercase transition-all"
            style={{
              backgroundColor: BRAND_COLORS.gold,
              color: BRAND_COLORS.dark,
            }}
          >
            Export PNG
          </motion.button>
        </motion.div>
      )}
    </motion.aside>
  );
};
