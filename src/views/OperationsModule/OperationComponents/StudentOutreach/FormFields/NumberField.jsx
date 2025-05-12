import React from 'react';

const NumberField = ({ 
  name, 
  value, 
  onChange, 
  error,
  min = 0,
  step = 1,
  isReadOnly = false,
  className = '',
  onBlur
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
        onBlur={onBlur}
      />
      <div style={{ minHeight: '20px' }}>
        {error && <span className="error">{error}</span>}
      </div>
    </div>
  );
};

export default NumberField; 