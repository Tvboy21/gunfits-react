import { DesignElement, DesignHistory } from '../types';

export const generateId = (): string => {
  return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const exportDesignAsJSON = (elements: DesignElement[]): string => {
  return JSON.stringify(elements, null, 2);
};

export const importDesignFromJSON = (json: string): DesignElement[] => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Invalid JSON:', error);
    return [];
  }
};

export const exportDesignAsPNG = async (canvasRef: HTMLCanvasElement, filename: string = 'design.png') => {
  const link = document.createElement('a');
  link.href = canvasRef.toDataURL('image/png');
  link.download = filename;
  link.click();
};

export const calculateZIndex = (elements: DesignElement[]): number => {
  if (elements.length === 0) return 1;
  return Math.max(...elements.map(el => el.zIndex)) + 1;
};

export const clampValue = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const roundToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const isWithinSafeArea = (element: DesignElement, padding: number): boolean => {
  return (
    element.x >= padding &&
    element.y >= padding &&
    element.x + element.width <= 600 - padding &&
    element.y + element.height <= 800 - padding
  );
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(price);
};

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const rotatePoint = (x: number, y: number, angle: number, cx: number = 0, cy: number = 0): [number, number] => {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const nx = (x - cx) * cos - (y - cy) * sin + cx;
  const ny = (x - cx) * sin + (y - cy) * cos + cy;
  return [nx, ny];
};
