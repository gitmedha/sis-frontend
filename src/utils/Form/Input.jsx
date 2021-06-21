import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";

const Input = (props) => {
  let { label, name, ...rest } = props;
  return (
    <div className="form-group">
      <label className="text-heading" htmlFor={name}>
        {label}
      </label>
      <Field id={name} name={name} {...rest} />
      <ErrorMessage name={name} component={InputErr} />
    </div>
  );
};

export default Input;
