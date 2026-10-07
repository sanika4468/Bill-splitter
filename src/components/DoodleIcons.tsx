import React from 'react';

interface DoodleProps {
  className?: string;
  size?: number;
  color?: string;
}

export const DoodlePizza: React.FC<DoodleProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 12C18 8 30 8 40 12L24 42L8 12Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 11C18 6 30 6 41 11"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Pepperoni dots & cheese drips */}
    <circle cx="24" cy="20" r="3" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" />
    <circle cx="18" cy="28" r="2.5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" />
    <circle cx="30" cy="26" r="2.5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" />
    <path d="M12 18C14 20 15 19 16 17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M32 17C33 19 35 19 36 17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const DoodleChai: React.FC<DoodleProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Mug body */}
    <path
      d="M10 16H34V32C34 36.4 30.4 40 26 40H18C13.6 40 10 36.4 10 32V16Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Handle */}
    <path
      d="M34 20H37C39.2 20 41 21.8 41 24V28C41 30.2 39.2 32 37 32H34"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Steaming vapor */}
    <path
      d="M17 12C16 10 17 8 18 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M22 13C21 10 23 8 23 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M27 12C26 10 27 8 28 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Saucer */}
    <path d="M6 42H38" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const DoodleBurger: React.FC<DoodleProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Top bun */}
    <path
      d="M10 20C10 12 16 7 24 7C32 7 38 12 38 20H10Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sesame seeds */}
    <circle cx="18" cy="13" r="1" fill={color} />
    <circle cx="24" cy="11" r="1" fill={color} />
    <circle cx="30" cy="14" r="1" fill={color} />
    {/* Patty */}
    <rect x="8" y="24" width="32" height="6" rx="3" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.2" />
    {/* Lettuce wave */}
    <path
      d="M7 21C9 20 11 22 13 21C15 20 17 22 19 21C21 20 23 22 25 21C27 20 29 22 31 21C33 20 35 22 37 21C39 20 41 21 41 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Bottom bun */}
    <path
      d="M10 33H38C38 38 32 41 24 41C16 41 10 38 10 33Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DoodleSamosa: React.FC<DoodleProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Triangular fried samosa */}
    <path
      d="M24 7C28 14 39 30 40 37C40.5 40 37 42 34 41C27 39 21 39 14 41C11 42 7.5 40 8 37C9 30 20 14 24 7Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Crust ridge & crisp texture */}
    <path d="M24 16V35" stroke={color} strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" />
    <circle cx="19" cy="27" r="1.5" fill={color} />
    <circle cx="28" cy="29" r="1.5" fill={color} />
    {/* Sparkle */}
    <path d="M39 13L41 10M41 10L43 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DoodleReceipt: React.FC<DoodleProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Wavy restaurant receipt */}
    <path
      d="M12 8C12 6.9 12.9 6 14 6H34C35.1 6 36 6.9 36 8V41L32 38L28 41L24 38L20 41L16 38L12 41V8Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18 14H30" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 20H26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 26H28" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Smiley face at bottom */}
    <path d="M21 32C22 33 26 33 27 32" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DoodleCocktail: React.FC<DoodleProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Glass cone */}
    <path
      d="M10 12L24 28L38 12H10Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Stem & base */}
    <path d="M24 28V42M16 42H32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Olive on stick */}
    <path d="M28 8L18 22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="21" cy="18" r="2.5" fill={color} />
  </svg>
);

export const DoodleCheers: React.FC<DoodleProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left beer mug */}
    <path d="M13 18H23V34C23 35.1 22.1 36 21 36H15C13.9 36 13 35.1 13 34V18Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M13 22H9C7.9 22 7 22.9 7 24V28C7 29.1 7.9 30 9 30H13" stroke={color} strokeWidth="2" />
    {/* Right beer mug */}
    <path d="M25 18H35V34C35 35.1 34.1 36 33 36H27C25.9 36 25 35.1 25 34V18Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M35 22H39C40.1 22 41 22.9 41 24V28C41 29.1 40.1 30 39 30H35" stroke={color} strokeWidth="2" />
    {/* Clink sparks */}
    <path d="M24 10V14M21 12L27 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
