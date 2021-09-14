import InputErr from "./InputErr";
import React, { useState } from 'react';
import styled from "styled-components";
import { FaSearch, FaAngleDown } from "react-icons/fa";
import { Field, ErrorMessage } from "formik";
import { components } from "react-select";
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

const style = {
  control: (base) => ({
    ...base,
    border: "1px solid #ced4da",
    borderRadius: "2px",
    "&:hover": {
      borderColor: "#ced4da",
    },
  }),
  singleValue: (provided, state) => {
    if (state.selectProps.icon === 'down') {
      // don't do anything if it's a dropdown
      return {};
    }
    // when the menu is open, remove the text displayed in the input
    // this is done to make lookup field as type & search
    return {
      display: state.selectProps.menuIsOpen ? 'none' : 'block',
    }
  }
};

const IconRenderer = ({ icon }) => {
  switch (icon) {
    case "down":
      return <FaAngleDown size={15} />;
    default:
      return <FaSearch size={15} />;
  }
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <IconRenderer icon={props.selectProps.icon} />
    </components.DropdownIndicator>
  );
};

const SelectField = (props) => {
  const {
    icon,
    form,
    field,
    placeholder,
    onChange = () => {},
    isSearchable = false,
    filterData
  } = props;
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  const loadOptions = (inputValue, callback) => {
    filterData(inputValue).then(data => {
      console.log('data here', data);
      setOptions(data);
      callback(data);
    });
  };

  const handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    setInputValue(inputValue);
    return inputValue;
  };

  return (
      <AsyncSelect
        icon={icon}
        name={field.name}
        styles={style}
        loadOptions={loadOptions}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        isSearchable={isSearchable || icon !== 'down'}
        components={{ DropdownIndicator }}
        onChange={(option) => {console.log('changed', field); form.setFieldValue(field.name, option.value); onChange(option);}}
        value={
          options ? options.find((option) => option.value === field.value) : null
        }
        cacheOptions
        defaultOptions
      />
  );
};

const SelectLookupAsync = (props) => {
  const { label, name, required, ...rest } = props;
  return (
    <SelectLookupAsyncField>
      <div className="form-group">
        <label className="text-heading" htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
        <Field id={name} name={name} component={SelectField} {...rest} />
        <ErrorMessage name={name} component={InputErr} />
      </div>
    </SelectLookupAsyncField>
  );
};

export default SelectLookupAsync;

