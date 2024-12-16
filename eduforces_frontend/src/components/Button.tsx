import React from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ label, onClick}) => {
  return (
    <button onClick={onClick} className="btn-signin">
      {label}
    </button>
  );
};

export default Button;
