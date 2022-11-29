import InputErr from "./InputErr";
import { ErrorMessage } from "formik";
import styled from "styled-components";

const MouUploadInputField = styled.div`
  label {
    color: #787B96;
  }
  .required {
    color: red;
    font-size: 16px;
  }
`;

const MouUploadInput = (props) => {
  let { label, name, required, ...rest } = props;
  return (
    <MouUploadInputField className="form-group">
      <label className="text-heading leading-24" htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        {...rest}
      />
      <ErrorMessage name={name} component={InputErr} />
    </MouUploadInputField>
  );
};

export default MouUploadInput;
