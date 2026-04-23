import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard = ({ children, className = '', onClick }: GlassCardProps) => {
  return (
    <div className={`glass-card p-6 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
