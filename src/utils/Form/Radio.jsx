import React from "react";
import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";

const Radio = (props) => {
  const { label, name, options, ...rest } = props;
  return (
    <div className="form-group">
      <label htmlFor={name} className="text-heading mr-4 mb-1">
        {label}
      </label>
      <div className="d-flex">
        <Field name={name} {...rest}>
          {({ field }) => {
            return options.map((opt) => (
              <div className="custom-control custom-radio mr-4" key={opt.key}>
                <input
                  {...field}
                  type="radio"
                  id={opt.value}
                  value={opt.value}
                  className="custom-control-input"
                  checked={field.value === opt.value}
                />
                <label
                  htmlFor={opt.value}
                  className="px-5 pt-1 custom-control-label text--md"
                >
                  {opt.key}
                </label>
              </div>
            ));
          }}
        </Field>
      </div>
      <ErrorMessage name={name} component={InputErr} />
    </div>
  );
};

export default Radio;
