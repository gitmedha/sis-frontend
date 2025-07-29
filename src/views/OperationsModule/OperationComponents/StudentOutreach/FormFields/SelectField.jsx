import React from 'react';
import Select from 'react-select';

const SelectField = ({ 
  label,
  name, 
  value, 
  options, 
  onChange, 
  error, 
  isDisabled = false,
  className = '',
  onBlur
}) => {
  const currentValue = options.find(option => option.value === value) || null;
  
  return (
    <div className={`select-field-container ${className}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <Select
        className={`table-input ${error ? "border-red" : ""}`}
        classNamePrefix="select"
        isClearable={true}
        isSearchable={true}
        name={name}
        options={options}
        value={currentValue}
        onChange={onChange}
        isDisabled={isDisabled}
        onMenuClose={onBlur}
      />
      <div style={{ minHeight: '20px' }}>
        {error && <span className="error">{error}</span>}
      </div>
    </div>
  );
};

export default SelectField;