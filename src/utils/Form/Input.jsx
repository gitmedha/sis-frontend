import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";

const InputField = styled.div`
  label {
    color: #787B96;
  }
  label > sup {
    color: red;
    font-size:20px; 
    vertical-align:-13px;
    }
`;

const Input = (props) => {
  let { label, name, ...rest } = props;
  return (
    <InputField className="form-group">
      <label className="text-heading" htmlFor={name}>
        {label}
      </label>
      <Field id={name} name={name} {...rest} />
      <ErrorMessage name={name} component={InputErr} />
    </InputField>
  );
};

export default Input;
