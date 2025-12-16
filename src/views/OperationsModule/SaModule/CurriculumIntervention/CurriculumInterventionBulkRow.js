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

const CurriculumInterventionBulkRow = (props) => {
  const { row, updateRow, classValue, medhaPocOptions } = props;

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

  // Dropdown options - static for module fields
  const moduleCreatedForOptions = [
    { label: "Medha", value: "Medha" },
    { label: "External Party", value: "External Party" },
    { label: "Internal Party", value: "Internal Party" }
  ];

  const moduleDevelopedRevisedOptions = [
    { label: "Developed", value: "Developed" },
    { label: "Revised", value: "Revised" }
  ];

  const govtDeptPartnerWithOptions = [
    "Department of Skill Development and Employment",
    "Directorate of Technical Education",
    "Skill Development of Industrial Training",
    "Department of Higher Education",
    "Department of Technical Education",
    "Department of Secondary Education",
    "DVEDSE",
    "Department of Labor and Resource"
  ].sort((a, b) => a.localeCompare(b))
   .map(type => ({ label: type, value: type }));

  return (
    <tr>
      {/* Module Created For */}
      <td>
        <Select
          styles={customSelectStyles}
          className={`${getSelectClass("module_created_for")}`}
          classNamePrefix="select"
          value={moduleCreatedForOptions.find(option => option.value === row.module_created_for)}
          onChange={option => handleChange("module_created_for", option?.value)}
          options={moduleCreatedForOptions}
          isClearable={true}
        />
      </td>
      {/* Module Developed / Revised */}
      <td>
        <Select
          styles={customSelectStyles}
          className={`${getSelectClass("module_developed_revised")}`}
          classNamePrefix="select"
          value={moduleDevelopedRevisedOptions.find(option => option.value === row.module_developed_revised)}
          onChange={option => handleChange("module_developed_revised", option?.value)}
          options={moduleDevelopedRevisedOptions}
          isClearable={true}
        />
      </td>
      {/* Start Date */}
      <td>
        <div className={`date-picker-ui ${getSelectClass("start_date")}`}> 
          <DatePicker
            selected={row.start_date ? new Date(row.start_date) : null}
            onChange={date => handleDateChange(date, "start_date")}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            className="form-control"
          />
        </div>
      </td>
      {/* End Date */}
      <td>
        <div className={`date-picker-ui ${getSelectClass("end_date")}`}> 
          <DatePicker
            selected={row.end_date ? new Date(row.end_date) : null}
            onChange={date => handleDateChange(date, "end_date")}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            className="form-control"
          />
        </div>
      </td>
      {/* Module Name */}
      <td>
        <input
          type="text"
          className={getInputClass("module_name")}
          value={row.module_name || ""}
          onChange={e => handleInputChange(e, "module_name")}
        />
      </td>
      {/* Govt. Department Partnered With */}
      <td>
        <Select
          styles={customSelectStyles}
          className={`${getSelectClass("govt_dept_partnered_with")}`}
          classNamePrefix="select"
          value={govtDeptPartnerWithOptions.find(option => option.value === row.govt_dept_partnered_with)}
          onChange={option => handleChange("govt_dept_partnered_with", option?.value)}
          options={govtDeptPartnerWithOptions}
          isClearable={true}
        />
      </td>
      {/* Medha POC */}
      <td>
        <Select
          styles={customSelectStyles}
          className={`${getSelectClass("medha_poc")}`}
          classNamePrefix="select"
          value={medhaPocOptions.find(option => option.value === row.medha_poc)}
          onChange={option => handleChange("medha_poc", option?.value)}
          options={medhaPocOptions}
          isClearable={true}
        />
      </td>
    </tr>
  );
};

export default CurriculumInterventionBulkRow;