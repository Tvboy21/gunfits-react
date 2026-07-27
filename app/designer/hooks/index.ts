'use client';

import { useEffect } from 'react';
import { useDesignStore } from '../store/designStore';

export const useKeyboardShortcuts = () => {
  const { undo, redo, removeElement, selectedElementId, duplicateElement } = useDesignStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'z' && e.shiftKey) || (e.key === 'y')) {
          e.preventDefault();
          redo();
        } else if (e.key === 'd') {
          e.preventDefault();
          if (selectedElementId) duplicateElement(selectedElementId);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (selectedElementId) removeElement(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, removeElement, selectedElementId, duplicateElement]);
};

export const useAutoSave = (interval: number = 30000) => {
  const { saveDesign, isDirty } = useDesignStore();

  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty) {
        saveDesign();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isDirty, saveDesign]);
};

export const useCanvasZoom = () => {
  const { zoomLevel, setZoom } = useDesignStore();

  const zoomIn = () => setZoom(Math.min(zoomLevel + 0.1, 2));
  const zoomOut = () => setZoom(Math.max(zoomLevel - 0.1, 0.5));
  const resetZoom = () => setZoom(1);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoomLevel]);

  return { zoomIn, zoomOut, resetZoom, zoomLevel };
};

export const useFileUpload = () => {
  const handleFileSelect = (
    file: File,
    onLoad: (data: string) => void
  ): void => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      onLoad(data);
    };
    reader.readAsDataURL(file);
  };

  return { handleFileSelect };
};

export const useDragAndDrop = () => {
  const { addElement, activeSide } = useDesignStore();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        addElement({
          type: 'image',
          x: e.clientX - 100,
          y: e.clientY - 100,
          width: 150,
          height: 150,
          rotation: 0,
          opacity: 1,
          content: data,
          side: activeSide,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return { handleDrop };
};
