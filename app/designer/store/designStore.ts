'use client';

import { create } from 'zustand';
import { DesignElement, DesignState, ApparelSide } from '../types';
import { generateId, calculateZIndex, saveToLocalStorage, loadFromLocalStorage } from '../utils/helpers';

const STORAGE_KEY = '4luv-design';

interface DesignStore extends DesignState {
  addElement: (element: Omit<DesignElement, 'id' | 'zIndex'>) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  selectElement: (id: string | null) => void;
  setActiveSide: (side: ApparelSide) => void;
  setZoom: (level: number) => void;
  undo: () => void;
  redo: () => void;
  clearDesign: () => void;
  saveDesign: () => void;
  loadDesign: () => void;
  setSelectedColor: (color: string) => void;
  setSelectedSize: (size: string) => void;
  toggleSnapToGrid: () => void;
  duplicateElement: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
}

const initialState: DesignState = {
  elements: [],
  activeSide: 'front',
  selectedElementId: null,
  zoomLevel: 1,
  history: [],
  historyIndex: -1,
  isDirty: false,
  snapToGrid: true,
  gridSize: 10,
  selectedColor: '#060606',
  selectedSize: 'M',
};

export const useDesignStore = create<DesignStore>((set, get) => ({
  ...initialState,

  addElement: (element) => {
    set((state) => {
      const newElement: DesignElement = {
        ...element,
        id: generateId(),
        zIndex: calculateZIndex(state.elements),
      };
      return {
        elements: [...state.elements, newElement],
        isDirty: true,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          {
            timestamp: Date.now(),
            elements: [...state.elements, newElement],
            activeSide: state.activeSide,
          },
        ],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  removeElement: (id) => {
    set((state) => {
      const newElements = state.elements.filter((el) => el.id !== id);
      return {
        elements: newElements,
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        isDirty: true,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          {
            timestamp: Date.now(),
            elements: newElements,
            activeSide: state.activeSide,
          },
        ],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  updateElement: (id, updates) => {
    set((state) => {
      const newElements = state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      return {
        elements: newElements,
        isDirty: true,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          {
            timestamp: Date.now(),
            elements: newElements,
            activeSide: state.activeSide,
          },
        ],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  selectElement: (id) => {
    set({ selectedElementId: id });
  },

  setActiveSide: (side) => {
    set({ activeSide: side });
  },

  setZoom: (level) => {
    set({ zoomLevel: level });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const prevHistory = state.history[state.historyIndex - 1];
        return {
          elements: prevHistory.elements,
          activeSide: prevHistory.activeSide,
          historyIndex: state.historyIndex - 1,
          selectedElementId: null,
        };
      }
      return state;
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const nextHistory = state.history[state.historyIndex + 1];
        return {
          elements: nextHistory.elements,
          activeSide: nextHistory.activeSide,
          historyIndex: state.historyIndex + 1,
          selectedElementId: null,
        };
      }
      return state;
    });
  },

  clearDesign: () => {
    set((state) => ({
      elements: [],
      selectedElementId: null,
      isDirty: true,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          timestamp: Date.now(),
          elements: [],
          activeSide: state.activeSide,
        },
      ],
      historyIndex: state.historyIndex + 1,
    }));
  },

  saveDesign: () => {
    const state = get();
    saveToLocalStorage(STORAGE_KEY, {
      elements: state.elements,
      activeSide: state.activeSide,
      selectedColor: state.selectedColor,
      selectedSize: state.selectedSize,
    });
    set({ isDirty: false });
  },

  loadDesign: () => {
    const saved = loadFromLocalStorage(STORAGE_KEY);
    if (saved) {
      set({
        elements: saved.elements || [],
        activeSide: saved.activeSide || 'front',
        selectedColor: saved.selectedColor || '#060606',
        selectedSize: saved.selectedSize || 'M',
        isDirty: false,
      });
    }
  },

  setSelectedColor: (color) => {
    set({ selectedColor: color });
  },

  setSelectedSize: (size) => {
    set({ selectedSize: size });
  },

  toggleSnapToGrid: () => {
    set((state) => ({ snapToGrid: !state.snapToGrid }));
  },

  duplicateElement: (id) => {
    const state = get();
    const element = state.elements.find((el) => el.id === id);
    if (element) {
      const duplicated: DesignElement = {
        ...element,
        id: generateId(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: calculateZIndex(state.elements),
      };
      set({
        elements: [...state.elements, duplicated],
        isDirty: true,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          {
            timestamp: Date.now(),
            elements: [...state.elements, duplicated],
            activeSide: state.activeSide,
          },
        ],
        historyIndex: state.historyIndex + 1,
      });
    }
  },

  bringToFront: (id) => {
    const state = get();
    const maxZIndex = Math.max(...state.elements.map((el) => el.zIndex), 0);
    set({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, zIndex: maxZIndex + 1 } : el
      ),
    });
  },

  sendToBack: (id) => {
    const state = get();
    const minZIndex = Math.min(...state.elements.map((el) => el.zIndex), 0);
    set({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, zIndex: minZIndex - 1 } : el
      ),
    });
  },
}));
