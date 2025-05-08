import React from 'react';

const NumberField = ({ 
  name, 
  value, 
  onChange, 
  error,
  min = 0,
  step = 1,
  isReadOnly = false,
  className = '' 
}) => {
  return (
    <div className={`number-field-container ${className}`}>
      <input
        className={`table-input h-2 ${error ? "border-red" : ""}`}
        type="number"
        name={name}
        min={min}
        step={step}
        value={value !== undefined ? value : 0}
        onChange={(e) => onChange(e.target.value)}
        readOnly={isReadOnly}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default NumberField; 