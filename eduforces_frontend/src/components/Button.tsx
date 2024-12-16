import React from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  style?: React.CSSProperties;
  color?: string;  
  backgroundColor?: string; 
}

const Button: React.FC<ButtonProps> = ({ label, onClick, color, backgroundColor, style }) => {
  const buttonStyle: React.CSSProperties = {
    ...style,
    color: color || 'white',  
    backgroundColor: backgroundColor || '#5D5A88', 
  };

  return (
    <button onClick={onClick} className="btn-signin" style={buttonStyle}>
      {label}
    </button>
  );
};

export default Button;