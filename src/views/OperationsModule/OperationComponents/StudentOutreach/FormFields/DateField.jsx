import React from 'react';

const DateField = ({ 
  name, 
  value, 
  onChange, 
  error,
  isDisabled = false,
  className = '' 
}) => {
  // Format ISO date string to YYYY-MM-DD for input
  const formattedValue = value?.split('T')[0] || '';
  
  return (
    <div className={`date-field-container ${className}`}>
      <input
        type="date"
        name={name}
        value={formattedValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        className={error ? 'border-red' : ''}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default DateField;
