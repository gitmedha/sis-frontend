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


const EcosystemBulkrow = (props) => {
  const { row, updateRow, activityTypeOptions, partnerTypeOptions, classValue } = props;

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
      {/* Activity Type */}
      <td>
        <Select
          styles={customSelectStyles}
          className={`${getSelectClass("activity_type")}`}
          classNamePrefix="select"
          value={activityTypeOptions.find(
            (option) => option.value === row.activity_type
          )}
          onChange={(option) => handleChange("activity_type", option?.value)}
          options={activityTypeOptions}
          isClearable={true}
        />
      </td>

      {/* Date of Activity */}
      <td>
        <div className={getSelectClass("date_of_activity")}>
          <DatePicker
            selected={row.date_of_activity ? new Date(row.date_of_activity) : null}
            onChange={(date) => handleDateChange(date, "date_of_activity")}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            className="form-control"
          />
        </div>
      </td>

      {/* Topic */}
      <td>
        <input
          type="text"
          className={getInputClass("topic")}
          value={row.topic || ""}
          onChange={(e) => handleInputChange(e, "topic")}
        />
      </td>

      {/* Government Department Partner */}
      <td>
        <input
          type="text"
          className="form-control"
          value={row.govt_dept_partner_with || ""}
          onChange={(e) => handleInputChange(e, "govt_dept_partner_with")}
        />
      </td>

      {/* Type of Partner */}
      <td>
        <Select
        styles={customSelectStyles}

          className={`${getSelectClass("type_of_partner")}`}
          classNamePrefix="select"
          value={partnerTypeOptions.find(
            (option) => option.value === row.type_of_partner
          )}
          onChange={(option) => handleChange("type_of_partner", option?.value)}
          options={partnerTypeOptions}
          isClearable={true}
        />
      </td>

      {/* Employer/External Party/NGO Partner */}
      <td>
        <input
          type="text"
          className="form-control"
          value={row.employer_name_external_party_ngo_partner_with || ""}
          onChange={(e) =>
            handleInputChange(e, "employer_name_external_party_ngo_partner_with")
          }
        />
      </td>

      {/* Total Attended Students */}
      <td>
        <input
          type="number"
          min="0"
          className={getInputClass("attended_students")}
          value={row.attended_students || ""}
          onChange={(e) => handleInputChange(e, "attended_students")}
        />
      </td>

      {/* Male Participants */}
      <td>
        <input
          type="number"
          min="0"
          className={getInputClass("male_participants")}
          value={row.male_participants || ""}
          onChange={(e) => handleInputChange(e, "male_participants")}
        />
      </td>

      {/* Female Participants */}
      <td>
        <input
          type="number"
          min="0"
          className={getInputClass("female_participants")}
          value={row.female_participants || ""}
          onChange={(e) => handleInputChange(e, "female_participants")}
        />
      </td>

      {/* Primary POC */}
      <td>
        <input
          type="text"
          className={getInputClass("medha_poc_1")}
          value={row.medha_poc_1 || ""}
          onChange={(e) => handleInputChange(e, "medha_poc_1")}
        />
      </td>

      {/* Secondary POC */}
      <td>
        <input
          type="text"
          className="form-control"
          value={row.medha_poc_2 || ""}
          onChange={(e) => handleInputChange(e, "medha_poc_2")}
        />
      </td>
    </tr>
  );
};

export default EcosystemBulkrow;