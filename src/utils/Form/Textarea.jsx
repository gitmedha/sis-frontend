import React from "react";
import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";

const Textarea = (props) => {
  const { label, name, ...rest } = props;
  return (
    <div className="form-group">
      <label className="text-heading" htmlFor={name}>
        {label}
      </label>
      <Field as="textarea" id={name} name={name} {...rest} />
      <ErrorMessage name={name} component={InputErr} />
    </div>
  );
};

export default Textarea;
