import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { COUNT_USERS_TOTS, GET_STUDENT_SYSTEM_ACTOR_RATIO } from "../../../graphql/operations"; // Added new import
import api from "../../../apis";

const StudentOutreachRowdata = ({ row, updateRow, setRows }) => {
  const [errors, setErrors] = useState({});
  const [designations, setDesignations] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [studentSystemActorRatio, setStudentSystemActorRatio] = useState(null);



  // State to department/project mapping
  const STATE_DEPARTMENT_MAP = {
    Haryana: [
      { value: "DST, Haryana", label: "DST, Haryana" },
      { value: "DHE Samarth, Haryana", label: "DHE Samarth, Haryana" },
      { value: "DTE, Haryana", label: "DTE, Haryana" },
      { value: "SDIT, Haryana", label: "SDIT, Haryana" },
      { value: "Department of Higher Education", label: "Department of Higher Education" },

    ],
    Bihar: [
      {
        value: "Project Swayam, Labor and Resource Department, Bihar",
        label: "Project Swayam, Labor and Resource Department, Bihar",
      },
    ],
    UttarPradesh: [
      {
        value: "DVEDSE (ITI transformation)",
        label: "DVEDSE (ITI transformation)",
      },
      { value: "DSE (Svapoorna)", label: "DSE (Svapoorna)" },
      { value: "ISTEUP (Polytechnic)", label: "ISTEUP (Polytechnic)" },
    ],
    Uttarkhand: [
      { value: "UKWDP", label: "UKWDP" },
      {
        value: "Dakshtata -Skill Development & Employment (Ongoing 2024-28)",
        label: "Dakshtata -Skill Development & Employment (Ongoing 2024-28)",
      },
    ],
  };

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

  const categoryOptions = [
    { value: "Student Outreach", label: "Student Outreach" },
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

  // Get department options based on selected state
  const getDepartmentOptions = () => {
    return STATE_DEPARTMENT_MAP[row.state] || [];
  };

  // Find the current department value
  const getCurrentDepartmentValue = () => {
    const options = getDepartmentOptions();
    return options.find((option) => option.value === row.department) || null;
  };

  // Function to determine financial year based on date (assuming Indian FY: April-March)
  const getFinancialYear = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  // Function to determine quarter based on date
  const getQuarterFromDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const month = date.getMonth() + 1;

    if (month >= 4 && month <= 6) return "Q1";
    if (month >= 7 && month <= 9) return "Q2";
    if (month >= 10 && month <= 12) return "Q3";
    if (month >= 1 && month <= 3) return "Q4";

    return "";
  };

  // Function to get month name from date
  const getMonthFromDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[date.getMonth()];
  };

  // Handle input change for text and number fields
  const handleInputChange = (field, value) => {
    updateRow(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  // Handle Select change for gender
  const handleGenderChange = (selectedOption) => {
    updateRow("gender", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, gender: "" }));
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
    // updateRow("department", ""); // Reset department
    setErrors((prev) => ({ ...prev, state: "", department: "" }));
  };

  const handleDepartmentChange = (selectedOption) => {
    updateRow("department", selectedOption ? selectedOption.value : "");
    setErrors((prev) => ({ ...prev, department: "" }));
  };

  const handleQuarterChange = (selectedOption) => {
    updateRow("quarter", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, quarter: "" }));
  };

  // Handle date changes and update financial year and quarter automatically
  const handleDateChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  
    if (field === "start_date" && value) {
      const fy = getFinancialYear(value);
      // Update both fields at once
      setRows(prev => prev.map(prevRow => 
        ({ ...prevRow, start_date: value, year_fy: fy })
      ));
    } else {
      updateRow(field, value);
    }
  };

  const handleEndDateChange = (value) => {
    setErrors((prev) => ({ ...prev, end_date: "" }));
  
    if (value) {
      const quarter = getQuarterFromDate(value);
      const month = getMonthFromDate(value);
      // Single atomic update for end_date, quarter, and month
      setRows(prevRows => prevRows.map(prevRow => 
        ({ ...prevRow, end_date: value, quarter: quarter, month: month })
      ));
    } else {
      // Just update end_date if no quarter calculation needed
      updateRow("end_date", value);
    }
  };

  // Handle Select change for category
  const handleCategoryChange = (selectedOption) => {
    updateRow("category", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, category: "" }));
  };

  // Function to fetch student system actor ratio
  const fetchStudentSystemActorRatio = async () => {
   
    
    if (!row.department || !projectNames[0]) {
      return;
    }

    try {
      // Special designations list
      const specialDesignations = ["TPO", "Principal", "TCAPO", "ESI", "Instructor"];
      
      // Count designations from the response data
      const designationCounts = {};
      
      // Count each designation type from the values array
      if (Array.isArray(designations)) {        
        designations.forEach(designation => {
          // Skip empty designations
          if (!designation) {
            return;
          }
          
          // Categorize as special designation or Faculty
          const category = specialDesignations.includes(designation) ? designation : "Faculty";          
          designationCounts[category] = (designationCounts[category] || 0) + 1;
        });
      }
      
      // Calculate total students based on each designation type
      let totalStudents = 0;
      let totalRatios = {};
      let foundInstitutionType = "";
      let promises = [];
      
      // List of designations we'll query
      const designationsToQuery = Object.keys(designationCounts);
      
      // Prepare all API calls in parallel
      for (const designationType of designationsToQuery) {
        const count = designationCounts[designationType] || 0;
        
        if (count > 0) {
          const promise = api.post("/graphql", {
            query: GET_STUDENT_SYSTEM_ACTOR_RATIO,
            variables: {
              project_name: projectNames[0],
              designations: designationType
            }
          }).then(response => {
            
            // Extract values array
            const values = response.data?.data?.studentSystemActorRatiosConnection?.values || [];
            
            if (values.length > 0) {
              const ratioData = values[0];
              
              // If we found an institution_type, store it
              if (ratioData.institution_type) {
                foundInstitutionType = ratioData.institution_type;
              }
              
              if (ratioData.student_system_actor_ratio) {
                // Parse ratio as a number to ensure it's valid
                const parsedRatio = parseFloat(ratioData.student_system_actor_ratio);
                
                if (!isNaN(parsedRatio) && parsedRatio > 0) {
                  return {
                    designationType,
                    count,
                    ratio: parsedRatio,
                    institution_type: ratioData.institution_type || ""
                  };
                } else {
                  console.warn(`Invalid ratio value for ${designationType}: ${ratioData.student_system_actor_ratio}`);
                }
              } else {
                console.warn(`No student_system_actor_ratio field found for ${designationType}`);
              }
            } else {
              console.warn(`No ratio data found for ${designationType}`);
            }
            
            return null;
          }).catch(error => {
            console.error(`Error fetching ratio for ${designationType}:`, error);
            return null;
          });
          
          promises.push(promise);
        }
      }
      
      // Wait for all API calls to complete
      const results = await Promise.all(promises);
      
      let anyValidRatioFound = false;

      // Check if we have any valid ratio results
      const validResults = results.filter(result => result !== null);
      for (const result of validResults) {
        if (result) {
          const { designationType, count, ratio, institution_type } = result;
          totalRatios[designationType] = ratio;
          
          // If we found an institution_type and haven't set one yet, use this one
          if (institution_type && !foundInstitutionType) {
            foundInstitutionType = institution_type;
          }
          
          // Calculate students for this designation type
          const studentsForThisType = count * ratio;
          
          if (!isNaN(studentsForThisType) && isFinite(studentsForThisType) && studentsForThisType > 0) {
            anyValidRatioFound = true;
            totalStudents += studentsForThisType;
          } else {
            console.warn(`Invalid student calculation for ${designationType}: ${count} × ${ratio} = ${studentsForThisType}`);
          }
        }
      }
      
      
      // Store the ratio data for reference
      setStudentSystemActorRatio({ 
        student_system_actor_ratio: totalRatios,
        project_name: projectNames[0],
        institution_type: foundInstitutionType
      });
      
      // Always update the student count, even if it's zero
      // But only if we actually got data from the API
      if (anyValidRatioFound || results.length > 0) {
        const roundedStudents = totalStudents > 0 ? Math.round(totalStudents) : 0;
        
        // Always update the student count regardless of value
        updateRow("students", roundedStudents);
        
        // Create a local variable to track the expected update
        const studentUpdatePromise = new Promise(resolve => {
          // Wait slightly to allow state update
          setTimeout(() => {
            resolve();
          }, 100);
        });
        
        await studentUpdatePromise;
      } else {
      }
      
      // Update institution type if available, or clear it if not found
      if (foundInstitutionType) {
        updateRow("institution_type", foundInstitutionType);
      } else {
        // Don't reset institution_type if we don't have a value - this prevents clearing other fields
        // updateRow("institution_type", "");
      }
      
    } catch (error) {
      console.error("Error calculating students from ratios:", error);
      setStudentSystemActorRatio(null);
    }
  };

  const fetchFacultyCount = async () => {
    if (!row.start_date || !row.end_date || !row.state || !row.department) {
      // Reset values if criteria are incomplete
      setDesignations([]);
      setProjectNames([]);
      
      // Explicitly reset student count
      updateRow("students", 0);
      updateRow("institution_type", "");
      
      return 0;
    }

    try {
      const response = await api.post("/graphql", {
        query: COUNT_USERS_TOTS,
        variables: {
          startDate: row.start_date,
          endDate: row.end_date,
          state: row.state,
          dept: row.department || null,
        },
      });

      // Extract designations and project names from the response
      const designationsArray = response.data?.data?.usersTotsConnection?.values?.map(item => item.designation) || [];
      const projectNamesArray = response.data?.data?.usersTotsConnection?.values?.map(item => item.project_name) || [];
      
      
      
      // Update state only if we have values
      if (designationsArray.length > 0) {
        setDesignations(designationsArray);
      } else {
        setDesignations([]);
        // No designations means no faculty
        updateRow("faculty", 0);
      }
      
      if (projectNamesArray.length > 0) {
        setProjectNames(projectNamesArray);
      } else {
        setProjectNames([]);
        updateRow("faculty", 0);
      }
      
      const count = response.data?.data?.usersTotsConnection?.aggregate?.count || 0;
      
      // If count is 0, clear faculty selection and student count
      if (count === 0) {
        updateRow("faculty", 0);
        // Explicitly reset student count when faculty count is zero
        updateRow("students", 0);
        // Only clear institution type if it's empty
        if (!row.institution_type) {
          updateRow("institution_type", "");
        }
      }
      
      return count;
    } catch (error) {
      console.error("Error fetching faculty count:", error);
      // Reset values on error
      setDesignations([]);
      setProjectNames([]);
      updateRow("faculty", "");
      // Explicitly reset student count on error
      updateRow("students", 0);
      updateRow("institution_type", "");
      return 0;
    }
  };

  

  // Call fetchFacultyCount when relevant filters change
  useEffect(() => {
    const fetchCount = async () => {
      if (row.start_date && row.end_date && row.state && row.department) {
        const count = await fetchFacultyCount();
        console.log(count, 'count')
        // Update faculty count state
        updateRow("faculty", count);
        
      }
    };
    fetchCount();
  }, [row.start_date, row.end_date, row.state, row.department]);

  // Trigger fetch when faculty is selected or any required parameter changes
  useEffect(() => {
    // Only reset values if faculty is explicitly zero, not for any positive value
    if (row.faculty === 0) {
      updateRow("students", 0);
      updateRow("institution_type", "");
      return;
    }
    
    // Only trigger new data fetch if we have all dependencies and faculty is positive
    if (row.faculty > 0 && 
        row.start_date && row.end_date && 
        row.state && row.department && 
        designations.length > 0 && projectNames.length > 0) {
      
      // Use a slight delay to ensure the faculty value is processed
      setTimeout(() => {
        fetchStudentSystemActorRatio();
      }, 200);
    }
  }, [row.faculty, row.start_date, row.end_date, row.state, row.department, designations.length, projectNames.length]);

console.log(row, 'row')
  return (
    <tr>
      {/* Start Date */}
      <td>
        <input
          type="date"
          value={row.start_date?.split("T")[0] || ""} // Handle potential ISO string format
          onChange={(e) => handleDateChange("start_date", e.target.value)}
        />
        {errors.start_date && (
          <span className="error">{errors.start_date}</span>
        )}
      </td>

      {/* End Date */}
      <td>
        <input
          type="date"
          value={row.end_date?.split("T")[0] || ""}
          onChange={(e) => handleEndDateChange(e.target.value)}
        />
        {errors.end_date && <span className="error">{errors.end_date}</span>}
      </td>

      {/* Financial Year - Now read-only as it's auto-determined */}
      <td>
        <input
          className={`table-input h-2 ${errors.year_fy ? "border-red" : ""}`}
          type="text"
          value={row.year_fy || ""}
          onChange={(e) => handleInputChange("year_fy", e.target.value)}
          readOnly
        />
        {errors.year_fy && <span className="error">{errors.year_fy}</span>}
      </td>

      {/* Quarter - Now read-only as it's determined by end date */}
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
          isDisabled={true}
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
        <Select
          className={`table-input ${errors.category ? "border-red" : ""}`}
          classNamePrefix="select"
          isClearable={true}
          name="category"
          options={categoryOptions}
          value={categoryOptions.find(
            (option) => option.value === row.category
          )}
          onChange={handleCategoryChange}
        />
        {errors.category && <span className="error">{errors.category}</span>}
      </td>

      {/* State */}
      <td>
        <Select
          className={`table-input ${errors.state ? "border-red" : ""}`}
          classNamePrefix="select"
          isClearable={true}
          // isSearchable={true}
          name="state"
          options={stateOptions}
          value={stateOptions.find((option) => option.value === row.state)}
          onChange={handleStateChange}
        />
        {errors.state && <span className="error">{errors.state}</span>}
      </td>

      {/* Department */}
      <td>
        <Select
          className={`table-input ${errors.department ? "border-red" : ""}`}
          classNamePrefix="select"
          isClearable={true}
          // isSearchable={true}
          name="department"
          options={getDepartmentOptions()}
          value={getCurrentDepartmentValue()}
          onChange={handleDepartmentChange}
          isDisabled={!row.state}
        />
        {errors.department && (
          <span className="error">{errors.department}</span>
        )}
      </td>

      {/* Faculty dropdown */}
      <td>
        <input
          className={`table-input h-2 ${errors.faculty ? "border-red" : ""}`}
          type="number"
          min="0"
          value={row.faculty !== undefined ? row.faculty : 0}
          onChange={(e) => {
            updateRow("faculty", parseInt(e.target.value) || 0);
          }}
          readOnly
        />
        {errors.faculty && <span className="error">{errors.faculty}</span>}
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
          readOnly
        />
        {errors.institution_type && (
          <span className="error">{errors.institution_type}</span>
        )}
      </td>

      {/* Students */}
      <td>
        <input
          className={`table-input h-2 ${errors.students ? "border-red" : ""}`}
          type="number"
          value={row.students !== null ? row.students : 0}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10) || 0;
            handleInputChange("students", newValue);
          }}
          readOnly
        />
        {errors.students && <span className="error">{errors.students}</span>}
      </td>
    </tr>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default StudentOutreachRowdata;