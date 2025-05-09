import React, { useEffect } from "react";
import DateField from "./FormFields/DateField";
import SelectField from "./FormFields/SelectField";
import NumberField from "./FormFields/NumberField";
import TextField from "./FormFields/TextField";
import useFacultyData from "./hooks/useFacultyData";
import useStudentData from "./hooks/useStudentData";
import useMaleFemaleData from "./hooks/useMaleFemaleData";
import useFormValidation from "./hooks/useFormValidation";
import { 
  quarterOptions, 
  categoryOptions, 
  monthOptions, 
  stateOptions,
  STATE_DEPARTMENT_MAP,
  INSTITUTION_TYPE_OPTIONS_MAP
} from "./utils/constants";
import { 
  getFinancialYear, 
  getQuarterFromDate, 
  getMonthFromDate 
} from "./utils/dateUtils";

const StudentOutreachRowdata = ({ row, updateRow, setRows, setIsSaveDisabled }) => {
  // Get form validation
  const { errors, setErrors } = useFormValidation(row, setIsSaveDisabled);
  
  // Get faculty and related data
  const { designations, projectNames } = useFacultyData(
    row.start_date,
    row.end_date,
    row.state,
    row.department,
    updateRow,
    setIsSaveDisabled
  );

  // Get student calculations
  useStudentData(
    row.faculty,
    row.category,
    row.department,
    designations,
    projectNames,
    updateRow,
    setRows,
    setIsSaveDisabled
  );
  
  // Get male/female data pre-population
  useMaleFemaleData(
    row.category,
    projectNames,
    updateRow,
    row.students
  );

  // Get department options based on selected state
  const getDepartmentOptions = () => {
    return STATE_DEPARTMENT_MAP[row.state] || [];
  };

  // Get institution type options based on selected state and department
  const getInstitutionTypeOptions = () => {
    if (
      row.state &&
      row.department &&
      INSTITUTION_TYPE_OPTIONS_MAP[row.state] &&
      INSTITUTION_TYPE_OPTIONS_MAP[row.state][row.department]
    ) {
      return INSTITUTION_TYPE_OPTIONS_MAP[row.state][row.department];
    }
    // Default options if no mapping found
    return [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
      { value: "option4", label: "Option 4" },
      { value: "option5", label: "Option 5" },
    ];
  };

  // Handle input change for text and number fields
  const handleInputChange = (field, value) => {
    updateRow(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  // Handle date changes and update financial year
  const handleDateChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "start_date" && value) {
      const fy = getFinancialYear(value);
      // Update both fields at once
      setRows((prev) =>
        prev.map((prevRow) => ({ ...prevRow, start_date: value, year_fy: fy }))
      );
    } else {
      updateRow(field, value);
    }
  };

  // Handle end date changes and update quarter and month
  const handleEndDateChange = (value) => {
    setErrors((prev) => ({ ...prev, end_date: "" }));

    if (value) {
      const quarter = getQuarterFromDate(value);
      const month = getMonthFromDate(value);
      // Single atomic update for end_date, quarter, and month
      setRows((prevRows) =>
        prevRows.map((prevRow) => ({
          ...prevRow,
          end_date: value,
          quarter: quarter,
          month: month,
        }))
      );
    } else {
      // Just update end_date if no quarter calculation needed
      updateRow("end_date", value);
    }
  };

  // Handle numeric input for male and female fields
  const handleMaleFemaleChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    updateRow(field, numValue);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  // Handle Select change for month
  const handleMonthChange = (selectedOption) => {
    updateRow("month", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, month: "" }));
  };

  // Handle state change
  const handleStateChange = (selectedOption) => {
    const stateValue = selectedOption ? selectedOption.value : "";
    updateRow("state", stateValue);
    setErrors((prev) => ({ ...prev, state: "", department: "" }));
  };

  // Handle department change
  const handleDepartmentChange = (selectedOption) => {
    updateRow("department", selectedOption ? selectedOption.value : "");
    setErrors((prev) => ({ ...prev, department: "" }));
  };

  // Handle quarter change
  const handleQuarterChange = (selectedOption) => {
    updateRow("quarter", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, quarter: "" }));
  };

  // Handle Select change for category
  const handleCategoryChange = (selectedOption) => {
    updateRow("category", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, category: "" }));
  };

  // Handle institution type change
  const handleInstitutionTypeChange = (selectedOption) => {
    handleInputChange("institution_type", selectedOption ? selectedOption.value : "");
  };

  // Handle category changes - reset students when category is not Student Outreach
  useEffect(() => {
    if (row.category !== "Student Outreach") {
      // Only reset if previously had a value, keep 0 if already 0
      if (row.students > 0) {
        updateRow("students", 0);
      }
    }
  }, [row.category]);

  return (
    <tr>
      {/* Start Date */}
      <td>
        <DateField
          name="start_date"
          value={row.start_date}
          onChange={(value) => handleDateChange("start_date", value)}
          error={errors.start_date}
        />
      </td>

      {/* End Date */}
      <td>
        <DateField
          name="end_date"
          value={row.end_date}
          onChange={handleEndDateChange}
          error={errors.end_date}
        />
      </td>

      {/* Financial Year - Now read-only as it's auto-determined */}
      <td>
        <TextField
          name="year_fy"
          value={row.year_fy}
          onChange={(value) => handleInputChange("year_fy", value)}
          error={errors.year_fy}
          isReadOnly={true}
        />
      </td>

      {/* Quarter - Now read-only as it's determined by end date */}
      <td>
        <SelectField
          name="quarter"
          options={quarterOptions}
          value={row.quarter}
          onChange={handleQuarterChange}
          error={errors.quarter}
          isDisabled={true}
        />
      </td>

      {/* Month */}
      <td>
        <SelectField
          name="month"
          options={monthOptions}
          value={row.month}
          onChange={handleMonthChange}
          error={errors.month}
        />
      </td>

      {/* Category */}
      <td>
        <SelectField
          name="category"
          options={categoryOptions}
          value={row.category}
          onChange={handleCategoryChange}
          error={errors.category}
        />
      </td>

      {/* State */}
      <td>
        <SelectField
          name="state"
          options={stateOptions}
          value={row.state}
          onChange={handleStateChange}
          error={errors.state}
        />
      </td>

      {/* Department */}
      <td>
        <SelectField
          name="department"
          options={getDepartmentOptions()}
          value={row.department}
          onChange={handleDepartmentChange}
          error={errors.department}
          isDisabled={!row.state}
        />
      </td>

      {/* Faculty - only show for Student Outreach */}
      {row.category === "Student Outreach" && (
        <td>
          <NumberField
            name="faculty"
            value={row.faculty}
            onChange={(value) => updateRow("faculty", parseInt(value) || 0)}
            error={errors.faculty}
            isReadOnly={true}
          />
        </td>
      )}

      {/* Male/Female fields */}
      <td>
        <NumberField
          name="male"
          value={row.male}
          onChange={(value) => handleMaleFemaleChange("male", value)}
          error={errors.male}
          step={0.01}
          isReadOnly={row.category === "Student Outreach"}
        />
      </td>
      <td>
        <NumberField
          name="female"
          value={row.female}
          onChange={(value) => handleMaleFemaleChange("female", value)}
          error={errors.female}
          step={0.01}
          isReadOnly={row.category === "Student Outreach"}
        />
      </td>

      {/* Institution Type */}
      <td>
        {row.category !== "Student Outreach" ? (
          <SelectField
            name="institution_type"
            options={getInstitutionTypeOptions()}
            value={row.institution_type}
            onChange={handleInstitutionTypeChange}
            error={errors.institution_type}
          />
        ) : (
          <TextField
            name="institution_type"
            value={row.institution_type}
            onChange={(value) => handleInputChange("institution_type", value)}
            error={errors.institution_type}
            isReadOnly={true}
          />
        )}
      </td>

      {/* Students - only show when category is Student Outreach */}
      {row.category === "Student Outreach" && (
        <td>
          <NumberField
            name="students"
            value={row.students}
            onChange={() => {}} // No handler as it's read-only
            error={errors.students}
            isReadOnly={true}
          />
        </td>
      )}
    </tr>
  );
};

export default StudentOutreachRowdata;
