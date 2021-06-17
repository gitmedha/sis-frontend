import React from "react";
import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";

const Select = (props) => {
  const { label, name, options, ...rest } = props;

  return (
    <div className="form-group">
      <label className="text-heading" htmlFor={name}>
        {label}
      </label>
      <Field as="select" id={name} name={name} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.key}
          </option>
        ))}
      </Field>
      <ErrorMessage name={name} component={InputErr} />
    </div>
  );
};

export default Select;
