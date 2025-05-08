import React from 'react';

const TextField = ({ 
  name, 
  value, 
  onChange, 
  error,
  isReadOnly = false,
  className = '' 
}) => {
  return (
    <div className={`text-field-container ${className}`}>
      <input
        className={`table-input h-2 ${error ? "border-red" : ""}`}
        type="text"
        name={name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        readOnly={isReadOnly}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default TextField; 