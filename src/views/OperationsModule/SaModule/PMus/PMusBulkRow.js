import React from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '38px',
    height: '38px',
    boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : provided.boxShadow,
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: '38px',
    padding: '0 8px',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '38px',
  }),
};

const PmusBulkrow = (props) => {
  const { row, updateRow, stateOptions, classValue, medhaPocOptions } = props;

  const handleChange = (field, value) => {
    updateRow(row.id, field, value);
  };

  const handleDateChange = (date, field) => {
    updateRow(row.id, field, date);
  };

  const handleInputChange = (e, field) => {
    updateRow(row.id, field, e.target.value);
  };

  const getInputClass = (field) => {
    return classValue[field] ? "form-control error-border" : "form-control";
  };

  const getSelectClass = (field) => {
    return classValue[field] ? "error-border" : "";
  };

  return (
    <tr>
      {/* Year */}
      <td>
        <div className={getSelectClass("year")}>
          <DatePicker
            selected={row.year ? new Date(row.year) : null}
            onChange={(date) => handleDateChange(date, "year")}
            dateFormat="yyyy"
            placeholderText="Select year"
            className="form-control"
            showYearPicker
          />
        </div>
      </td>

      {/* PMU Name */}
      <td>
        <input
          type="text"
          className={getInputClass("pmu")}
          value={row.pmu || ""}
          onChange={(e) => handleInputChange(e, "pmu")}
        />
      </td>

      {/* State */}
      <td>
        <Select
          styles={customSelectStyles}
          className={`${getSelectClass("State")}`}
          classNamePrefix="select"
          value={stateOptions.find(
            (option) => option.value === row.State
          )}
          onChange={(option) => handleChange("State", option?.value)}
          options={stateOptions}
          isClearable={true}
        />
      </td>

      {/* Medha POC */}
      <td>
        <Select
          styles={customSelectStyles}
          className={`${getSelectClass("medha_poc")}`}
          classNamePrefix="select"
          value={medhaPocOptions.find(
            (option) => option.value === row.medha_poc
          )}
          onChange={(option) => handleChange("medha_poc", option?.value)}
          options={medhaPocOptions}
          isClearable={true}
        />
      </td>
    </tr>
  );
};

export default PmusBulkrow;