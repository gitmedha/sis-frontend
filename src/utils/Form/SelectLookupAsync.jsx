import React, { useState } from 'react';
import styled from "styled-components";
import AsyncSelect from 'react-select/async';

const SelectLookupAsyncField = styled.div`
  label {
    color: #787B96;
  }
  .required {
    color: red;
    font-size: 16px;
  }
`;

const filterColors = (inputValue) => {
  let colourOptions = [
    {
      label: 'Option 1'
    },
    {
      label: 'Option 2'
    },
  ];
  return colourOptions.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterColors(inputValue));
  }, 1000);
};

const SelectLookupAsync = (props) => {
  const { label, name, required, ...rest } = props;
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    setInputValue(inputValue);
    return inputValue;
  };
  return (
    <SelectLookupAsyncField>
      <label className="text-heading" htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <AsyncSelect
        name={name}
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        onInputChange={handleInputChange}
        placeholder="Institution"
      />
    </SelectLookupAsyncField>
  );
};

export default SelectLookupAsync;

