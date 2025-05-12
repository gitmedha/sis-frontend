import React from 'react';

const TextField = ({ 
  name, 
  value, 
  onChange, 
  error,
  isReadOnly = false,
  className = '',
  onBlur
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
        onBlur={onBlur}
      />
      <div style={{ minHeight: '20px' }}>
        {error && <span className="error">{error}</span>}
      </div>
    </div>
  );
};

export default TextField; 