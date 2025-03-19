import React, { useState } from "react";
import Select from "react-select";

const StudentOutreachRowdata = ({ row, updateRow }) => {
  const [errors, setErrors] = useState({});

  // Gender options for the Select component
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const quarterOptions = [
    { value: "Q1", label: "Q1" },
    { value: "Q2", label: "Q2" },
    { value: "Q3", label: "Q3" },
    { value: "Q4", label: "Q4" },
    { value: "Q1-Q4", label: "Q1-Q4" },
  ];

  // Month options for the Select component
  const monthOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const stateOptions = [
    { value: "Haryana", label: "Haryana" },
    { value: "Bihar", label: "Bihar" },
    { value: "UttarPradesh", label: "Uttar Pradesh" },
    { value: "Uttarkhand", label: "Uttarakhand" },
  ];

  // Handle input change for text and number fields
  const handleInputChange = (field, value) => {
    updateRow(row.id, field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  // Handle Select change for gender
  const handleGenderChange = (selectedOption) => {
    updateRow(row.id, "gender", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, gender: "" }));
  };

  // Handle Select change for month
  const handleMonthChange = (selectedOption) => {
    updateRow(row.id, "month", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, month: "" }));
  };
  const handleStateChange = (selectedOption) => {
    updateRow(row.id, "state", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, state: "" }));
  };

  const handleQuarterChange = (selectedOption) => {
    updateRow(row.id, "quarter", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, quarter: "" }));
  };

  return (
    <tr key={row.id}>
      {/* Financial Year */}
      <td>
        <input
          className={`table-input h-2 ${errors.year_fy ? "border-red" : ""}`}
          type="text"
          value={row.year_fy}
          onChange={(e) => handleInputChange("year_fy", e.target.value)}
        />
        {errors.year_fy && <span className="error">{errors.year_fy}</span>}
      </td>

      {/* Quarter */}
      <td>
        <Select
          className={`table-input ${errors.quarter ? "border-red" : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="quarter"
          options={quarterOptions}
          value={quarterOptions.find((option) => option.value === row.quarter)}
          onChange={handleQuarterChange}
        />
        {errors.quarter && <span className="error">{errors.quarter}</span>}
      </td>

      {/* Month */}
      <td>
        <Select
          className={`table-input ${errors.month ? "border-red" : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="month"
          options={monthOptions}
          value={monthOptions.find((option) => option.value === row.month)}
          onChange={handleMonthChange}
        />
        {errors.month && <span className="error">{errors.month}</span>}
      </td>

      {/* Category */}
      <td>
        <input
          className={`table-input h-2 ${errors.category ? "border-red" : ""}`}
          type="text"
          value={row.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
        />
        {errors.category && <span className="error">{errors.category}</span>}
      </td>

      {/* State */}
      <td>
        <Select
          className={`table-input ${errors.state ? "border-red" : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="state"
          options={stateOptions}
          value={stateOptions.find((option) => option.value === row.state)}
          onChange={handleStateChange}
        />
        {errors.state && <span className="error">{errors.state}</span>}
      </td>

      {/* Department */}
      <td>
        <input
          className={`table-input h-2 ${errors.department ? "border-red" : ""}`}
          type="text"
          value={row.department}
          onChange={(e) => handleInputChange("department", e.target.value)}
        />
        {errors.department && (
          <span className="error">{errors.department}</span>
        )}
      </td>

      {/* Gender */}
      <td>
        <Select
          className={`table-input ${errors.gender ? "border-red" : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="gender"
          options={genderOptions}
          value={genderOptions.find((option) => option.value === row.gender)}
          onChange={handleGenderChange}
        />
        {errors.gender && <span className="error">{errors.gender}</span>}
      </td>

      {/* Students */}
      <td>
        <input
          className={`table-input h-2 ${errors.students ? "border-red" : ""}`}
          type="number"
          value={row.students}
          onChange={(e) =>
            handleInputChange("students", parseInt(e.target.value, 10))
          }
        />
        {errors.students && <span className="error">{errors.students}</span>}
      </td>

      {/* Institution Type */}
      <td>
        <input
          className={`table-input h-2 ${
            errors.institution_type ? "border-red" : ""
          }`}
          type="text"
          value={row.institution_type}
          onChange={(e) =>
            handleInputChange("institution_type", e.target.value)
          }
        />
        {errors.institution_type && (
          <span className="error">{errors.institution_type}</span>
        )}
      </td>
    </tr>
  );
};

export default StudentOutreachRowdata;
