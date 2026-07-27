# 4LUV Premium Custom Apparel Designer

A luxury streetwear customization platform built with Next.js, React Three Fiber, Konva.js, and Framer Motion.

## Features

### Core Design Tools
- **Canvas Editor**: Drag-and-drop image and text placement with Konva.js
- **3D Preview**: Real-time 3D t-shirt preview with React Three Fiber
- **Multiple Surfaces**: Design on front, back, and sleeves
- **Safe Print Area**: Visual guides for printable regions
- **Unlimited Undo/Redo**: Full design history with state management

### Advanced Features
- **Auto-Save**: Automatic save to localStorage every 30 seconds
- **Design Export**: Export as PNG, JSON, or SVG formats
- **Keyboard Shortcuts**: Professional productivity shortcuts (Ctrl+Z, Ctrl+D, etc.)
- **Layer Management**: Control stacking order and visibility
- **Responsive Controls**: Zoom, rotate, and scale elements with precision controls
- **Snap to Grid**: Optional grid snapping for alignment
- **Color & Size Selection**: Choose from available product colors and sizes

### Design Elements
- **Images**: Upload and position custom artwork
- **Text**: Add text with customizable fonts, colors, and sizes
- **Logo**: Pre-designed brand logo placement

## Folder Structure

```
app/designer/
├── components/
│   ├── Canvas/
│   │   └── CanvasEditor.tsx          # Main Konva canvas
│   ├── Preview/
│   │   └── ThreePreview.tsx          # 3D preview with React Three Fiber
│   ├── Sidebar/
│   │   ├── LeftSidebar.tsx           # Tools and layers panel
│   │   └── RightSidebar.tsx          # Element properties
│   ├── Header.tsx                     # Navigation header
│   └── Navigation.tsx                 # Tab navigation
├── hooks/
│   └── index.ts                       # Custom React hooks
├── store/
│   └── designStore.ts                 # Zustand state management
├── types/
│   └── index.ts                       # TypeScript interfaces
├── utils/
│   ├── constants.ts                   # Brand colors and config
│   ├── helpers.ts                     # Utility functions
│   └── export.ts                      # Export functionality
├── styles.tsx                         # Global styles
├── page.tsx                           # Main designer page
└── layout.tsx                         # Designer layout wrapper
```

## Tech Stack

### Frontend Framework
- **Next.js 15**: App Router with React Server Components
- **React 19**: Latest React with server components
- **TypeScript**: Full type safety

### State Management
- **Zustand 4.5**: Lightweight state management with persistence

### Canvas & Graphics
- **Konva.js 9.2**: Professional 2D canvas library
- **React Konva 18.2**: React bindings for Konva
- **React Three Fiber 9.6**: React renderer for Three.js
- **Three.js 0.184**: 3D graphics library
- **@react-three/drei 9.88**: Three.js utilities

### Animations & Styling
- **Framer Motion 12.38**: Production-ready animation library
- **Tailwind CSS 4**: Utility-first CSS framework
- **html2canvas 1.4**: Screenshot functionality

### Additional
- **GSAP 3.15**: Advanced animation library
- **Firebase 12.13**: Backend services (optional)

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Install dependencies** (with legacy peer deps for compatibility):
```bash
npm install --legacy-peer-deps
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open browser**:
```
http://localhost:3000/designer
```

## Usage Guide

### Basic Workflow
1. **Start Designing**
   - Click "Upload Image" or "Add Text" in left sidebar
   - Drag elements onto the canvas
   - Click to select elements

2. **Edit Elements**
   - Select an element from layers panel
   - Use right sidebar to adjust position, size, rotation, opacity
   - Use layer controls to manage stacking order

3. **Switch Surfaces**
   - Click front/back/sleeve tabs to design different surfaces
   - Each surface maintains independent layers

4. **Preview Design**
   - Click "Preview" button to see 3D mockup
   - Switch between 3D and 2D views
   - Auto-rotates for product visualization

5. **Save & Export**
   - Click "Save" to store to localStorage
   - Export as PNG, JSON, or SVG from export menu
   - Print design directly from preview

### Keyboard Shortcuts
- **Ctrl+Z**: Undo last action
- **Ctrl+Shift+Z**: Redo
- **Ctrl+D**: Duplicate selected element
- **Delete**: Remove selected element
- **Ctrl+=**: Zoom in
- **Ctrl+-**: Zoom out

## Customization

### Brand Colors
Edit in `utils/constants.ts`:
```typescript
export const BRAND_COLORS = {
  dark: '#060606',
  orange: '#C94E0A',
  gold: '#F0BE00',
  blue: '#7FD4F0',
  maroon: '#8B1538',
};
```

### Canvas Configuration
Edit in `utils/constants.ts`:
```typescript
export const CANVAS_CONFIG = {
  WIDTH: 600,
  HEIGHT: 800,
  SAFE_AREA_PADDING: 40,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 2,
  GRID_SIZE: 10,
};
```

### Product Data
Modify `page.tsx` to fetch from API:
```typescript
const product = {
  id: productId,
  name: '4LUV Premium T-Shirt',
  price: 3500,
  thumbnail: 'https://...',
};
```

## Advanced Features

### Auto-Save
Designs auto-save every 30 seconds to localStorage. Modify interval in `page.tsx`:
```typescript
useAutoSave(30000); // milliseconds
```

### Design History
Full undo/redo history stored in Zustand. History persists during session.

### Export Formats
- **PNG**: Raster image with transparency support
- **JSON**: Design data for future loading
- **SVG**: Vector format for scalability

### 3D Mockup
Real-time 3D preview updates as you edit. Includes:
- Ambient + directional lighting
- Auto-rotating view
- Orbit controls
- Color customization

## Performance Optimizations

- Konva layer batching for efficient canvas rendering
- React memo for component optimization
- Zustand selectors to prevent unnecessary re-renders
- Lazy loading for 3D components
- CSS containment for layout isolation

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 13+)
- Mobile: Responsive design with touch support

## Responsive Design

The designer adapts to screen sizes:
- **Desktop (1920px+)**: Full 3-column layout with all panels visible
- **Tablet (1024px-1919px)**: Optimized sidebar widths
- **Mobile (<1024px)**: Toggleable sidebars, stacked layout

## Troubleshooting

### Canvas not rendering
- Check browser console for errors
- Ensure Konva Stage is mounted
- Verify canvas div has dimensions

### 3D preview not showing
- Check Three.js compatibility
- Verify WebGL support in browser
- Check console for WebGL errors

### Performance issues
- Reduce canvas zoom level
- Limit number of design elements
- Disable auto-rotation in preview

## Future Enhancements

- [ ] Backend design persistence to database
- [ ] Social sharing with design links
- [ ] Collaborative design editing
- [ ] Advanced text effects (shadow, outline, gradient)
- [ ] Pattern fills and gradients
- [ ] AI-powered design suggestions
- [ ] Mobile app version
- [ ] Design templates library
- [ ] Print on demand integration
- [ ] Real-time price calculation

## License

Proprietary - 4LUV Brand

## Support

For issues or feature requests, contact: support@4luv.com

---

**Made with ❤️ for 4LUV Premium Streetwear**
