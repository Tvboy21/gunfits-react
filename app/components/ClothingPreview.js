'use client';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';

export default function ClothingPreview({ design, clothingTypes }) {
  // Mockup images for each clothing type
  const mockupImages = {
    'T-Shirt': '/mockups/tshirt-white.png',
    'Hoodie': '/mockups/hoodie-white.png',
    'Jacket': '/mockups/jacket-white.png',
    'Cargo Pants': '/mockups/cargo-white.png',
    'Shorts': '/mockups/shorts-white.png',
  };

  // Position of print area on each mockup (as percentages)
  const printAreas = {
    'Front Center': { top: '35%', left: '50%', width: '40%' },
    'Back Center': { top: '35%', left: '50%', width: '40%' },
    'Left Chest': { top: '28%', left: '30%', width: '20%' },
    'Right Chest': { top: '28%', left: '70%', width: '20%' },
    'Left Sleeve': { top: '25%', left: '15%', width: '15%' },
    'Right Sleeve': { top: '25%', left: '85%', width: '15%' },
  };

  const printPos = printAreas[design.printPosition] || printAreas['Front Center'];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
      border: '1px solid #e0e0e0',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '500px',
      position: 'relative',
      marginBottom: '20px',
      overflow: 'hidden'
    }}>

      {/* Shadow base */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        width: '80%',
        height: '15px',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.1), transparent)',
        borderRadius: '50%'
      }}/>

      {/* Clothing mockup container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '280px',
        aspectRatio: '3/4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* Base clothing shape with color */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: design.baseColor.hex,
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          zIndex: 1,
          border: '1px solid rgba(0,0,0,0.1)',
        }}/>

        {/* Fabric texture overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: design.baseColor.hex,
          backgroundImage: 
            design.fabric === 'Denim' ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 8px)' :
            design.fabric === 'Fleece' ? 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)' :
            design.fabric === 'Linen' ? 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)' :
            design.fabric === 'Polyester' ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%)' :
            'none',
          backgroundSize:
            design.fabric === 'Denim' ? '8px 8px' :
            design.fabric === 'Fleece' ? '6px 6px' :
            design.fabric === 'Linen' ? '4px 4px' :
            design.fabric === 'Polyester' ? '10px 10px' :
            'auto',
          borderRadius: '8px',
          zIndex: 1,
          opacity: 0.6,
        }}/>

        {/* Clothing type icon */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '5rem',
          opacity: 0.2,
          pointerEvents: 'none',
          filter: 'grayscale(1)'
        }}>
          {clothingTypes.find(c => c.name === design.clothingType)?.icon}
        </div>

        {/* Print text on clothing */}
        {design.printText && (
          <div style={{
            position: 'absolute',
            top: printPos.top,
            left: printPos.left,
            transform: 'translate(-50%, -50%)',
            width: printPos.width,
            zIndex: 3,
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(0.8rem, 3vw, 1.2rem)',
              color: design.printColor.hex,
              letterSpacing: '0.12em',
              textAlign: 'center',
              margin: 0,
              textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
              lineHeight: 1.2,
              wordBreak: 'break-word'
            }}>
              {design.printText}
            </p>
          </div>
        )}

        {/* Graphic overlay if uploaded */}
        {design.graphicPublicId && (
          <div style={{
            position: 'absolute',
            top: printPos.top,
            left: printPos.left,
            transform: 'translate(-50%, -50%)',
            width: printPos.width,
            zIndex: 3,
          }}>
            <CldImage
              src={design.graphicPublicId}
              width={120}
              height={120}
              alt="Design graphic"
              style={{
                width: '100%',
                height: 'auto',
                filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.3))',
                borderRadius: '4px'
              }}
            />
          </div>
        )}
      </div>

      {/* Info below */}
      <div style={{ marginTop: '28px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#666666', textTransform: 'uppercase', margin: 0 }}>
          {design.clothingType} • {design.fabric} • {design.baseColor.name}
        </p>
      </div>
    </div>
  );
}