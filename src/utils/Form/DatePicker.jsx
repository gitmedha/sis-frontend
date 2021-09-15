import InputErr from "./InputErr";
import DateView from "react-datepicker";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import{ useRef } from "react";

const DatePickerField = styled.div`
.react-datepicker {
  font-size: 0.8em;
}

.react-datepicker__header {
  padding-top: 0.9em;
}

.react-datepicker__month {
  margin: 1em 1em;
}
.react-datepicker__day-name, .react-datepicker__day {
  width: 2.2em;
  line-height: 1.9em;
  margin: 0.3em;
}

.react-datepicker__current-month {
  font-size: 1em;
}

.react-datepicker__navigation {
  top: 13px !important;
  right: 90px
}

.react-datepicker__day{
  padding: 4px;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
  background-color: #257b69;
}

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
    z-index: 0;
  }
}
.required {
  color: red;
  font-size: 16px;
}
`;

const DatePicker = (props) => {
  const { name, label, required, ...rest } = props;
  const datepickerRef = useRef(null); 
  function handleClickDatepickerIcon() {
    const datepickerElement = datepickerRef.current;
    datepickerElement.setFocus(true);
  }

  return (
    <DatePickerField>
      <div className="form-group d-flex flex-column date-picker-ui">
        <label htmlFor={name} className="text-heading pb-1">
          {label}
          {required && <span className="required">*</span>}
        </label>
        <Field name={name}>
          {({ form, field }) => {
            const { value } = field;
            const { setFieldValue } = form;
            return (
              <div className="datepicker-wrapper">
                <DateView
                  dateFormat="dd MMM yyyy h:mm aa"
                  showTimeSelect
                  showYearDropdown
                  id={name}
                  {...field}
                  {...rest}
                  selected={value}
                  onChange={(val) => setFieldValue(name, val)}
                  ref={datepickerRef}
                />
                <span className="datepicker-icon" onClick={() => handleClickDatepickerIcon()}>
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
