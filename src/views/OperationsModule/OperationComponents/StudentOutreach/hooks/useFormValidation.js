import { useState, useEffect } from 'react';

const useFormValidation = (row, setDisableSaveButton) => {
  const [errors, setErrors] = useState({});

  // Validate all form fields
  const validateRow = () => {
    const newErrors = {};
    let isValid = true;

    // Check required fields for all categories
    if (!row.start_date) {
      newErrors.start_date = "Start date is required";
      isValid = false;
    }

    if (!row.end_date) {
      newErrors.end_date = "End date is required";
      isValid = false;
    }

    if (!row.year_fy) {
      newErrors.year_fy = "Financial year is required";
      isValid = false;
    }

    if (!row.quarter) {
      newErrors.quarter = "Quarter is required";
      isValid = false;
    }

    if (!row.month) {
      newErrors.month = "Month is required";
      isValid = false;
    }

    if (!row.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!row.state) {
      newErrors.state = "State is required";
      isValid = false;
    }

    if (!row.department) {
      newErrors.department = "Department is required";
      isValid = false;
    }

    // Category-specific validations
    if (row.category === "Student Outreach") {
      if (!row.institution_type) {
        newErrors.institution_type = "Institution type is required";
        isValid = false;
      }

      if (isNaN(row.faculty) || row.faculty <= 0) {
        newErrors.faculty = "Faculty must be greater than 0";
        isValid = false;
      }

      if (isNaN(row.students) || row.students <= 0) {
        newErrors.students = "Students must be greater than 0";
        isValid = false;
      }
      
      // For Student Outreach, validate both male and female fields
      if (isNaN(row.male) || row.male < 0) {
        newErrors.male = "Male count must be a valid number";
        isValid = false;
      }
      
      if (isNaN(row.female) || row.female < 0) {
        newErrors.female = "Female count must be a valid number";
        isValid = false;
      }
      
      // Ensure at least one gender has a value
      if (row.male === 0 && row.female === 0) {
        newErrors.male = "At least one gender count must be greater than 0";
        newErrors.female = "At least one gender count must be greater than 0";
        isValid = false;
      }
    } else {
      // For other categories
      if (!row.institution_type) {
        newErrors.institution_type = "Institution type is required";
        isValid = false;
      }

      // Either male or female should be greater than 0
      if ((isNaN(row.male) || row.male <= 0) && (isNaN(row.female) || row.female <= 0)) {
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
  }, [row]);

  return { errors, setErrors, validateRow };
};

export default useFormValidation;
