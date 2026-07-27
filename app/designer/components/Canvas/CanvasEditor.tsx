"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDesignStore } from '../../store/designStore';
import { DesignElement, ApparelSide } from '../../types';
import { CANVAS_CONFIG, BRAND_COLORS } from '../../utils/constants';

interface CanvasEditorProps {
  activeSide: ApparelSide;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ activeSide }) => {
  const {
    elements,
    selectedElementId,
    selectElement,
    updateElement,
    zoomLevel,
    snapToGrid,
    gridSize,
    activeSide: storeActiveSide,
  } = useDesignStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const currentSide = activeSide || storeActiveSide;
  const canvasElements = elements.filter((el) => el.side === currentSide);

  useEffect(() => {
    setCanvasReady(true);

    const handlePointerMove = (event: MouseEvent) => {
      if (!dragState.current) return;
      const { id, offsetX, offsetY } = dragState.current;
      updateElement(id, {
        x: event.clientX - offsetX,
        y: event.clientY - offsetY,
      });
    };

    const handlePointerUp = () => {
      dragState.current = null;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    return () => {
      setCanvasReady(false);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [updateElement]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const { addElement } = useDesignStore.getState();
        addElement({
          type: 'image',
          x: 100,
          y: 100,
          width: 150,
          height: 150,
          rotation: 0,
          opacity: 1,
          content: event.target?.result as string,
          side: storeActiveSide,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative flex items-center justify-center flex-1 min-h-screen pt-20 pb-8 px-4"
      style={{ backgroundColor: BRAND_COLORS.dark }}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at ${gridSize}px ${gridSize}px, ${BRAND_COLORS.orange}11 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Canvas wrapper with zoom transform */}
      <div
        className="relative rounded-lg overflow-hidden shadow-2xl"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}
      >
        <div
          ref={containerRef}
          className="relative"
          style={{
            width: CANVAS_CONFIG.WIDTH,
            height: CANVAS_CONFIG.HEIGHT,
            backgroundColor: '#1a1a1a',
            border: `2px solid ${BRAND_COLORS.orange}33`,
            boxShadow: `0 0 40px ${BRAND_COLORS.maroon}40`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20px 20px, ${BRAND_COLORS.orange}11 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          {canvasReady &&
            canvasElements.map((el) => (
              <div
                key={el.id}
                className="absolute cursor-pointer"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1,
                  border: selectedElementId === el.id ? `2px solid ${BRAND_COLORS.gold}` : '2px solid transparent',
                  boxSizing: 'border-box',
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectElement(el.id);
                  dragState.current = {
                    id: el.id,
                    offsetX: event.clientX - el.x,
                    offsetY: event.clientY - el.y,
                  };
                }}
                onClick={() => selectElement(el.id)}
              >
                {el.type === 'text' ? (
                  <div
                    className="w-full h-full flex items-center justify-center text-ellipsis overflow-hidden"
                    style={{
                      color: el.fontColor || BRAND_COLORS.text,
                      fontFamily: el.fontFamily || 'Arial',
                      fontSize: `${el.fontSize || 24}px`,
                      lineHeight: 1.1,
                    }}
                  >
                    {el.content}
                  </div>
                ) : (
                  <img
                    src={el.content}
                    alt="design element"
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};
