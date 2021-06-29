import InputErr from "./InputErr";
import { FaSearch } from "react-icons/fa";
import { Field, ErrorMessage } from "formik";
import Select, { components } from "react-select";

const SearchIcon = () => {
  return <FaSearch size={15} />;
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SearchIcon />
    </components.DropdownIndicator>
  );
};

export const SelectField = (props) => {
  const { options, field, form, placeholder, isSearchable = true } = props;

  return (
    <Select
      name={field.name}
      options={options}
      onBlur={field.onBlur}
      placeholder={placeholder}
      isSearchable={isSearchable}
      components={{ DropdownIndicator }}
      onChange={(option) => form.setFieldValue(field.name, option.value)}
      value={
        options ? options.find((option) => option.value === field.value) : null
      }
    />
  );
};

const SelectLookup = (props) => {
  const { label, name, ...rest } = props;
  return (
    <div className="form-group">
      <label className="text-heading" htmlFor={name}>
        {label}
      </label>
      <Field id={name} name={name} component={SelectField} {...rest} />
      <ErrorMessage name={name} component={InputErr} />
    </div>
  );
};

export default SelectLookup;
