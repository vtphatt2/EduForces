import React from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  style?: React.CSSProperties;
  color?: string;  
  backgroundColor?: string; 
  borderColor?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, color, backgroundColor, borderColor, style }) => {
  const buttonStyle: React.CSSProperties = {
    ...style,
    color: color || 'white',  
    backgroundColor: backgroundColor || '#5D5A88', 
    borderColor: borderColor || 'none',
  };

  return (
    <button onClick={onClick} className="btn-signin" style={buttonStyle}>
      {label}
    </button>
  );
};

export default Button;
