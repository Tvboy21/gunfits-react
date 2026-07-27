export type Apparel = 'tshirt' | 'hoodie' | 'crewneck';
export type ApparelSide = 'front' | 'back' | 'sleeve';
export type AssetType = 'image' | 'text' | 'logo';

export interface DesignElement {
  id: string;
  type: AssetType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  content: string; // URL for images, text content for text
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  isSelected?: boolean;
  side: ApparelSide;
  zIndex: number;
}

export interface DesignHistory {
  timestamp: number;
  elements: DesignElement[];
  activeSide: ApparelSide;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  thumbnail: string;
}

export interface DesignState {
  elements: DesignElement[];
  activeSide: ApparelSide;
  selectedElementId: string | null;
  zoomLevel: number;
  history: DesignHistory[];
  historyIndex: number;
  isDirty: boolean;
  snapToGrid: boolean;
  gridSize: number;
  selectedColor: string;
  selectedSize: string;
}

export interface ThreePreviewProps {
  design: DesignElement[];
  side: ApparelSide;
  color: string;
}
