import React from 'react';

interface Subject {
  name: string;
  value: number; // 0-100
  color: string;
}

interface SkillMapCardProps {
  subjects?: Subject[];
}

export default function SkillMapCard({ subjects: propSubjects }: SkillMapCardProps = {}) {
  // Default subjects (Demo-Daten) - werden durch Props überschrieben
  const defaultSubjects: Subject[] = [
    { name: 'Geschichte', value: 82, color: '#28B5E1' },
    { name: 'Mathe', value: 85, color: '#28B5E1' },
    { name: 'Chemie', value: 68, color: '#28B5E1' },
    { name: 'Franz.', value: 55, color: '#28B5E1' },
    { name: 'Sport', value: 88, color: '#28B5E1' },
    { name: 'Bio', value: 90, color: '#28B5E1' },
    { name: 'Geografie', value: 65, color: '#28B5E1' },
    { name: 'Musik', value: 75, color: '#28B5E1' },
    { name: 'Physik', value: 78, color: '#28B5E1' },
    { name: 'Englisch', value: 88, color: '#28B5E1' },
    { name: 'Deutsch', value: 72, color: '#28B5E1' },
    { name: 'Kunst', value: 100, color: '#28B5E1' },
  ];

  const subjects = propSubjects || defaultSubjects;

  return (
    <div 
      className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.1] rounded-[18px] p-5 transition-all duration-300 hover:border-white/[0.15] flex flex-col h-full" 
      style={{ isolation: 'isolate', zIndex: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <h3 className="font-['Poppins:Bold',sans-serif] text-[18px] text-white">
          Skill-Map
        </h3>
      </div>

      {/* Adaptive Chart */}
      <div className="flex-1 flex items-center justify-center">
        <AdaptiveSkillChart subjects={subjects} />
      </div>
    </div>
  );
}

// Adaptive Skill Chart - funktioniert von 1-14+ Fächern
function AdaptiveSkillChart({ subjects }: { subjects: Subject[] }) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const numPoints = subjects.length;
  
  // Adaptive Sizing basierend auf Anzahl der Fächer
  const getSize = () => {
    if (numPoints === 1) return { width: 180, height: 180 };
    if (numPoints === 2) return { width: 240, height: 180 };
    if (numPoints <= 4) return { width: 240, height: 240 };
    if (numPoints <= 8) return { width: 260, height: 260 };
    return { width: 280, height: 280 }; // 9+ Fächer
  };

  const { width, height } = getSize();
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Adaptive radius basierend auf Anzahl
  const radiusOuter = numPoints === 1 
    ? width * 0.2 
    : numPoints === 2 
    ? width * 0.3 
    : width * 0.35;

  // Spezielle Layouts für wenige Fächer
  const getSpecialLayout = () => {
    if (numPoints === 1) {
      // 1 Fach: Zentral
      return [{ x: centerX, y: centerY }];
    }
    
    if (numPoints === 2) {
      // 2 Fächer: Horizontal
      return [
        { x: centerX - radiusOuter, y: centerY },
        { x: centerX + radiusOuter, y: centerY },
      ];
    }
    
    // 3+ Fächer: Kreisförmig
    return null;
  };

  const specialLayout = getSpecialLayout();

  // Calculate polygon points for grid
  const getPolygonPoints = (scale: number) => {
    if (specialLayout) {
      return specialLayout.map(pos => ({
        x: centerX + (pos.x - centerX) * scale,
        y: centerY + (pos.y - centerY) * scale,
      }));
    }

    const points: { x: number; y: number }[] = [];
    const angleStep = (2 * Math.PI) / numPoints;
    const startAngle = -Math.PI / 2;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = startAngle + i * angleStep;
      const x = centerX + Math.cos(angle) * radiusOuter * scale;
      const y = centerY + Math.sin(angle) * radiusOuter * scale;
      points.push({ x, y });
    }
    
    return points;
  };

  // Calculate data points for subjects
  const getDataPoints = () => {
    if (specialLayout && numPoints <= 2) {
      // Spezial-Layout für 1-2 Fächer
      return subjects.map((subject, i) => {
        const basePos = specialLayout[i];
        const value = subject.value;
        
        if (numPoints === 1) {
          // 1 Fach: Pulsierender Kreis im Zentrum
          return { x: centerX, y: centerY, subject };
        }
        
        // 2 Fächer: Bewegung entlang horizontaler Achse
        const distance = (centerX - basePos.x) * (1 - value / 100);
        return { 
          x: basePos.x + distance, 
          y: basePos.y, 
          subject 
        };
      });
    }

    // 3+ Fächer: Kreisförmiges Layout
    const points: { x: number; y: number; subject: Subject }[] = [];
    const angleStep = (2 * Math.PI) / numPoints;
    const startAngle = -Math.PI / 2;
    
    subjects.forEach((subject, i) => {
      const angle = startAngle + i * angleStep;
      const value = subject.value;
      
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      // Value 100% = radiusOuter, 0% = center
      const baseRadius = radiusOuter * (value / 100);
      
      const x = centerX + cos * baseRadius;
      const y = centerY + sin * baseRadius;
      
      points.push({ x, y, subject });
    });
    
    return points;
  };

  const polygonOuter = getPolygonPoints(1.0);
  const polygonInner = getPolygonPoints(0.5);
  const dataPoints = getDataPoints();

  // Adaptive Label Sizing
  const getLabelSize = () => {
    if (numPoints <= 4) return '12px';
    if (numPoints <= 8) return '11px';
    if (numPoints <= 12) return '10px';
    return '9px'; // 13+ Fächer
  };

  return (
    <div className="relative" style={{ width, height }}>
      <svg
        className="block w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Render für 3+ Fächer: Polygon */}
        {numPoints >= 3 && (
          <>
            {/* Outer polygon */}
            <polygon
              points={polygonOuter.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="rgba(228, 234, 240, 0.25)"
              strokeWidth="1"
            />
            
            {/* Inner polygon (dashed) */}
            <polygon
              points={polygonInner.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="rgba(228, 234, 240, 0.25)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            
            {/* Radial lines from center to each subject */}
            {polygonOuter.map((point, i) => (
              <line
                key={`line-${i}`}
                x1={centerX}
                y1={centerY}
                x2={point.x}
                y2={point.y}
                stroke="rgba(228, 234, 240, 0.25)"
                strokeWidth="1"
              />
            ))}
            
            {/* Data polygon (filled area) */}
            <polygon
              points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="rgba(40, 181, 225, 0.1)"
              stroke="none"
            />
            
            {/* Data polygon (main solid stroke) */}
            <polygon
              points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#28B5E1"
              strokeWidth="3"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(40, 181, 225, 0.4))',
              }}
            />
          </>
        )}

        {/* Render für 2 Fächer: Horizontal Bar */}
        {numPoints === 2 && (
          <>
            {/* Background line */}
            <line
              x1={polygonOuter[0].x}
              y1={centerY}
              x2={polygonOuter[1].x}
              y2={centerY}
              stroke="rgba(228, 234, 240, 0.25)"
              strokeWidth="2"
            />
            
            {/* Center marker */}
            <circle
              cx={centerX}
              cy={centerY}
              r="2"
              fill="rgba(228, 234, 240, 0.4)"
            />
            
            {/* Data line */}
            <line
              x1={dataPoints[0].x}
              y1={dataPoints[0].y}
              x2={dataPoints[1].x}
              y2={dataPoints[1].y}
              stroke="#28B5E1"
              strokeWidth="3"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(40, 181, 225, 0.4))',
              }}
            />
          </>
        )}

        {/* Render für 1 Fach: Pulsierender Kreis */}
        {numPoints === 1 && (
          <>
            {/* Outer circle (100%) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radiusOuter}
              fill="none"
              stroke="rgba(228, 234, 240, 0.25)"
              strokeWidth="1"
            />
            
            {/* Inner circle (50%) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radiusOuter * 0.5}
              fill="none"
              stroke="rgba(228, 234, 240, 0.25)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            
            {/* Data circle (filled) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radiusOuter * (dataPoints[0].subject.value / 100)}
              fill="rgba(40, 181, 225, 0.15)"
              stroke="#28B5E1"
              strokeWidth="3"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(40, 181, 225, 0.5))',
              }}
            />
          </>
        )}
        
        {/* Data points (circles) - Interactive */}
        {dataPoints.map((point, i) => (
          <g key={`point-${i}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r={numPoints === 1 ? "8" : "5"}
              fill="#28B5E1"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200"
              style={{
                filter: hoveredIndex === i 
                  ? 'drop-shadow(0 0 12px rgba(40, 181, 225, 1))' 
                  : 'drop-shadow(0 0 6px rgba(40, 181, 225, 0.6))',
                transform: hoveredIndex === i ? 'scale(1.3)' : 'scale(1)',
                transformOrigin: `${point.x}px ${point.y}px`,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </g>
        ))}
      </svg>

      {/* Labels positioned adaptively */}
      {subjects.map((subject, i) => {
        let x: number, y: number;
        let textAlign: 'left' | 'center' | 'right' = 'center';
        let translateX = '-50%';
        let translateY = '-50%';

        if (numPoints === 1) {
          // 1 Fach: Label unten
          x = centerX;
          y = centerY + radiusOuter * 1.3;
          translateY = '0%';
        } else if (numPoints === 2) {
          // 2 Fächer: Links und rechts
          x = polygonOuter[i].x;
          y = centerY;
          textAlign = i === 0 ? 'right' : 'left';
          translateX = i === 0 ? '-120%' : '20%';
        } else {
          // 3+ Fächer: Kreisförmig
          const angleStep = (2 * Math.PI) / numPoints;
          const startAngle = -Math.PI / 2;
          const angle = startAngle + i * angleStep;
          
          const labelRadius = radiusOuter * 1.08;
          x = centerX + Math.cos(angle) * labelRadius;
          y = centerY + Math.sin(angle) * labelRadius;
          
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          
          if (cos > 0.3) {
            textAlign = 'left';
            translateX = '0%';
          } else if (cos < -0.3) {
            textAlign = 'right';
            translateX = '-100%';
          }
          
          if (sin < -0.3) {
            translateY = '-100%';
          } else if (sin > 0.3) {
            translateY = '0%';
          }
        }

        return (
          <div
            key={`label-${i}`}
            className="absolute font-['Poppins:SemiBold',sans-serif] text-[#b0b5b7] uppercase whitespace-nowrap pointer-events-none"
            style={{
              left: `${(x / width) * 100}%`,
              top: `${(y / height) * 100}%`,
              transform: `translate(${translateX}, ${translateY})`,
              fontSize: getLabelSize(),
              letterSpacing: '0.5px',
              textAlign,
            }}
          >
            {subject.name}
          </div>
        );
      })}

      {/* Hover Tooltip */}
      {hoveredIndex !== null && dataPoints[hoveredIndex] && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(dataPoints[hoveredIndex].x / width) * 100}%`,
            top: `${(dataPoints[hoveredIndex].y / height) * 100}%`,
            transform: 'translate(-50%, -150%)',
            animation: 'fadeInTooltip 0.2s ease-out',
          }}
        >
          <div
            className="px-3 py-1.5 rounded-lg"
            style={{
              background: 'rgba(40, 181, 225, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-[13px] font-['Poppins:Bold',sans-serif] text-white">
              {dataPoints[hoveredIndex].subject.value}%
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeInTooltip {
          from {
            opacity: 0;
            transform: translate(-50%, -140%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -150%);
          }
        }
      `}</style>
    </div>
  );
}
