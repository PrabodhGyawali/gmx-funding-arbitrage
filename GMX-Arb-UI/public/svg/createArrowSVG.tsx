import React from 'react';

interface CustomSVGProps {
  size: number;
  ratio: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isExpanded: boolean;
  className?: string;
}

const CustomSVG: React.FC<CustomSVGProps> = ({ size, ratio, direction, isExpanded, className = '' }) => {
  const width = size;
  const height = size * ratio;
  const strokeWidth = Math.max(1, Math.floor(size / 25));
  
  const arrowWidth = width * 0.6;
  const arrowHeight = height * 0.6;
  const lineLength = height * 0.6;
  
  let rotation = 0;
  switch (direction) {
    case 'up': rotation = 0; break;
    case 'right': rotation = 90; break;
    case 'down': rotation = 180; break;
    case 'left': rotation = 270; break;
  }

  const lineY = isExpanded ? height * 0.8 : height * 0.2;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform={`rotate(${rotation} ${width/2} ${height/2})`}>
        <line 
          x1={width*0.2} 
          y1={lineY} 
          x2={width*0.8} 
          y2={lineY} 
          stroke="black" 
          strokeWidth={strokeWidth}
        />
        <path 
          d={`M${width/2} ${height*0.8} 
              L${width/2} ${height*0.8 - lineLength} 
              L${width/2 - arrowWidth/2} ${height*0.8 - lineLength + arrowHeight/2} 
              M${width/2} ${height*0.8 - lineLength} 
              L${width/2 + arrowWidth/2} ${height*0.8 - lineLength + arrowHeight/2}`} 
          fill="none" 
          stroke="black" 
          strokeWidth={strokeWidth} 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
    </svg>
  );
};

export default CustomSVG;