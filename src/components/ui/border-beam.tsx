import React from 'react';
import '../../index.css';

interface BorderBeamProps {
  children?: React.ReactNode;
  delay?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({ children, delay = 0 }) => {
  return (
    <div className="snake-border-container">
      <div className="snake-border-content">
        {children}
      </div>
      <div className="snake-border-line" style={{ animationDelay: `${delay}s` }} />
    </div>
  );
};