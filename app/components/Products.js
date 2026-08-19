'use client';
import dynamic from 'next/dynamic';

const BounceCards = dynamic(() => import('./BounceCards'), { ssr: false });
const Lightning = dynamic(() => import('./Lightning'), { ssr: false });

const transformStyles = [
  "rotate(8deg) translate(-220px)",
  "rotate(3deg) translate(-80px)",
  "rotate(-5deg) translate(80px)",
  "rotate(-10deg) translate(220px)"
];

export default function Products() {
  const images = [
    '/logo.jpg.jpeg',
    '/bg.jpeg',
    '/logo.jpg.jpeg',
    '/bg.jpeg',
  ];

  return (
    <section className="products" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Lightning background */}
      <div style={{ 
  position: 'absolute', 
  inset: '-8% 0 -6% 0',
  zIndex: 0,
  minHeight: '420px',
  pointerEvents: 'none',
  willChange: 'transform'
}}>
  <Lightning
    hue={20}
    xOffset={0}
    speed={0.8}
    intensity={1.2}
    size={1}
  />
</div>

      {/* Content on top */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="products-header">
          <span className="section-tag">// 001 — New Arrivals</span>
          <h2 className="section-title">LATEST DROP</h2>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '60px',
          paddingBottom: '60px',
        }}>
          <BounceCards
            images={images}
            containerWidth={800}
            containerHeight={400}
            animationDelay={0.5}
            animationStagger={0.08}
            easeType="elastic.out(1, 0.5)"
            transformStyles={transformStyles}
            enableHover={true}
          />
        </div>
      </div>

    </section>
  );
}
