import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
      <input 
        className={`input-field ${className}`} 
        {...props} 
      />
    </div>
  );
};
