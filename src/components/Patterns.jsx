export function SeigaihaPattern({ 
  id = 'seigaiha', 
  className = 'absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none',
  strokeColor = '#1a1a1a',
  strokeWidth = 0.6 
}) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="18" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="20" cy="20" r="14" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="20" cy="20" r="10" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="0" cy="20" r="18" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="0" cy="20" r="14" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="0" cy="20" r="10" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="40" cy="20" r="18" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="40" cy="20" r="14" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="40" cy="20" r="10" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

export function SakuraFlower({ 
  className = 'w-5 h-5',
  color = '#FFB7C5',
  centerColor = '#E89AAE',
  opacity = 0.6 
}) {
  return (
    <svg className={className} viewBox="0 0 20 20">
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse 
          key={i}
          cx="10" 
          cy="5" 
          rx="2.5" 
          ry="4.5" 
          fill={color}
          opacity={opacity}
          transform={`rotate(${angle} 10 10)`}
        />
      ))}
      <circle cx="10" cy="10" r="2" fill={centerColor} opacity={opacity * 1.2} />
    </svg>
  )
}
