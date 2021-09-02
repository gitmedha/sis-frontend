import InputErr from "./InputErr";
import { FaSearch, FaAngleDown } from "react-icons/fa";
import { Field, ErrorMessage } from "formik";
import Select, { components } from "react-select";
import styled from "styled-components";

const SelectLookupField = styled.div`
  label {
    color: #787B96;
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

export const SelectField = (props) => {
  const {
    icon,
    form,
    field,
    options,
    placeholder,
    onChange = () => {},
    isSearchable = true,
  } = props;

  return (
    <Select
      icon={icon}
      styles={style}
      name={field.name}
      options={options}
      onBlur={field.onBlur}
      placeholder={placeholder}
      isSearchable={isSearchable}
      components={{ DropdownIndicator }}
      onChange={(option) => {form.setFieldValue(field.name, option.value); onChange(option);}}
      value={
        options ? options.find((option) => option.value === field.value) : null
      }
    />
  );
};

const SelectLookup = (props) => {
  const { label, name, ...rest } = props;
  return (
    <SelectLookupField>
      <div className="form-group">
        <label className="text-heading" htmlFor={name}>
          {label}
        </label>
        <Field id={name} name={name} component={SelectField} {...rest} />
        <ErrorMessage name={name} component={InputErr} />
      </div>
    </SelectLookupField>
  );
};

export default SelectLookup;
