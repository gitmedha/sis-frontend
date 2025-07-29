import React from 'react';

const DateField = ({ 
  name, 
  value, 
  onChange, 
  error,
  isDisabled = false,
  className = '',
  onBlur
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
        onBlur={onBlur}
        style={{ height: '38px', padding: '8px 12px' }}
      />
      <div style={{ minHeight: '20px' }}>
        {error && <span className="error">{error}</span>}
      </div>
    </div>
  );
};

export default DateField;