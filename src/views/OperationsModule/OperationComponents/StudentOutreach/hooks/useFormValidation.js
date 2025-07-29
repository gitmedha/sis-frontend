import { useState, useEffect } from 'react';

const useFormValidation = (row, setDisableSaveButton) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Validate all form fields
  const validateRow = () => {
    const newErrors = {};
    let isValid = true;

    // Helper to check if we should show error for a field
    const shouldShow = (field) => submitAttempted || touched[field];

    // Check required fields for all categories
    if (!row.start_date && shouldShow('start_date')) {
      newErrors.start_date = "Start date is required";
      isValid = false;
    }

    if (!row.end_date && shouldShow('end_date')) {
      newErrors.end_date = "End date is required";
      isValid = false;
    }

    if (!row.year_fy && shouldShow('year_fy')) {
      newErrors.year_fy = "Financial year is required";
      isValid = false;
    }

    if (!row.quarter && shouldShow('quarter')) {
      newErrors.quarter = "Quarter is required";
      isValid = false;
    }

    if (!row.month && shouldShow('month')) {
      newErrors.month = "Month is required";
      isValid = false;
    }

    if (!row.category && shouldShow('category')) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!row.state && shouldShow('state')) {
      newErrors.state = "State is required";
      isValid = false;
    }

    if (!row.department && shouldShow('department')) {
      newErrors.department = "Department is required";
      isValid = false;
    }

    // Category-specific validations
    if (row.category === "Student Outreach") {
      if (!row.institution_type && shouldShow('institution_type')) {
        newErrors.institution_type = "Institution type is required";
        isValid = false;
      }

      if ((isNaN(row.faculty) || row.faculty <= 0) && shouldShow('faculty')) {
        newErrors.faculty = "Faculty must be greater than 0";
        isValid = false;
      }

      if ((isNaN(row.students) || row.students <= 0) && shouldShow('students')) {
        newErrors.students = "Students must be greater than 0";
        isValid = false;
      }
      
      // For Student Outreach, validate both male and female fields
      if ((isNaN(row.male) || row.male < 0) && shouldShow('male')) {
        newErrors.male = "Male count must be a valid number";
        isValid = false;
      }
      
      if ((isNaN(row.female) || row.female < 0) && shouldShow('female')) {
        newErrors.female = "Female count must be a valid number";
        isValid = false;
      }
      
      // Ensure at least one gender has a value
      if ((row.male === 0 && row.female === 0) && (shouldShow('male') || shouldShow('female'))) {
        newErrors.male = "At least one gender count must be greater than 0";
        newErrors.female = "At least one gender count must be greater than 0";
        isValid = false;
      }
    } else {
      // For other categories
      if (!row.institution_type && shouldShow('institution_type')) {
        newErrors.institution_type = "Institution type is required";
        isValid = false;
      }

      // Either male or female should be greater than 0
      if (((isNaN(row.male) || row.male <= 0) && (isNaN(row.female) || row.female <= 0)) && (shouldShow('male') || shouldShow('female'))) {
        newErrors.male = "At least one gender count must be greater than 0";
        newErrors.female = "At least one gender count must be greater than 0";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Run validation when row data changes
  useEffect(() => {
    const isValid = validateRow();
    if (setDisableSaveButton) {
      setDisableSaveButton(!isValid);
    }
  }, [row, touched, submitAttempted]);

  // Expose setTouched and submitAttempted setter
  return { errors, setErrors, validateRow, touched, setTouched, submitAttempted, setSubmitAttempted };
};

export default useFormValidation;