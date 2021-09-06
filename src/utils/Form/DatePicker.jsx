import InputErr from "./InputErr";
import DateView from "react-datepicker";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";

const DatePickerField = styled.div`
  label {
    color: #787B96;
  }
`;

const DatePicker = (props) => {
  const { name, label, ...rest } = props;

  return (
    <DatePickerField>
      <div className="form-group d-flex flex-column date-picker-ui">
        <label htmlFor={name} className="text-heading pb-1">
          {label}
        </label>
        <Field name={name}>
          {({ form, field }) => {
            const { value } = field;
            const { setFieldValue } = form;
            return (
              <DateView
                dateFormat="dd MMM yyyy"
                id={name}
                {...field}
                {...rest}
                selected={value}
                onChange={(val) => setFieldValue(name, val)}
              />
            );
          }}
        </Field>
        <ErrorMessage name={name} component={InputErr} />
      </div>
    </DatePickerField>
  );
};

export default DatePicker;
