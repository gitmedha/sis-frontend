import InputErr from "./InputErr";
import DateView from "react-datepicker";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";

const DatePickerField = styled.div`
  label {
    color: #787B96;
  }

  .datepicker-wrapper {
    position: relative;

    .datepicker-icon {
      position: absolute;
      color: hsl(0, 0%, 80%);
      right: 0;
      top: 9px;
      padding: 0 8px;
      border-left: 1px solid hsl(0, 0%, 80%);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50%;
      z-index: 100;
    }
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
              <div className="datepicker-wrapper">
                <DateView
                  dateFormat="dd MMM yyyy"
                  showYearDropdown
                  id={name}
                  {...field}
                  {...rest}
                  selected={value}
                  onChange={(val) => setFieldValue(name, val)}
                />
                <span className="datepicker-icon">
                  <FaCalendarAlt size="15" />
                </span>
              </div>
            );
          }}
        </Field>
        <ErrorMessage name={name} component={InputErr} />
      </div>
    </DatePickerField>
  );
};

export default DatePicker;
