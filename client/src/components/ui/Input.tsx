import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">{label}</label>}
      <input 
        className={`input-field ${className}`} 
        {...props} 
      />
    </div>
  );
};

