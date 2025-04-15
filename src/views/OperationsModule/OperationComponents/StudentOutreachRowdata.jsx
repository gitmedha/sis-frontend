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

  // Handle state change
  const handleStateChange = (selectedOption) => {
    const stateValue = selectedOption ? selectedOption.value : "";
    console.log("Selected state:", stateValue); // Debugging

    updateRow(row.id, "state", stateValue);
    // updateRow(row.id, "department", ""); // Reset department
    setErrors((prev) => ({ ...prev, state: "", department: "" }));
  };

  const handleDepartmentChange = (selectedOption) => {
    updateRow(row.id, "department", selectedOption ? selectedOption.value : "");
    setErrors((prev) => ({ ...prev, department: "" }));
  };

  const handleQuarterChange = (selectedOption) => {
    updateRow(row.id, "quarter", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, quarter: "" }));
  };

  // Handle date changes and update financial year and quarter automatically
  const handleDateChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  
    if (field === "start_date" && value) {
      const fy = getFinancialYear(value);
      // Update both fields at once
      setRows(prev => prev.map(row => 
        row.id === row.id 
          ? { ...row, start_date: value, year_fy: fy }
          : row
      ));
    } else {
      updateRow(row.id, field, value);
    }
  };

  const handleEndDateChange = (value) => {
    setErrors((prev) => ({ ...prev, end_date: "" }));
  
    if (value) {
      const quarter = getQuarterFromDate(value);
      const month = getMonthFromDate(value);
      // Single atomic update for end_date, quarter, and month
      setRows(prevRows => prevRows.map(prevRow => 
        prevRow.id === row.id 
          ? { ...prevRow, end_date: value, quarter: quarter, month: month }
          : prevRow
      ));
    } else {
      // Just update end_date if no quarter calculation needed
      updateRow(row.id, "end_date", value);
    }
  };

  // Handle Select change for category
  const handleCategoryChange = (selectedOption) => {
    updateRow(row.id, "category", selectedOption ? selectedOption.value : "");
    setErrors((prevErrors) => ({ ...prevErrors, category: "" }));
  };

  // Function to fetch student system actor ratio
  const fetchStudentSystemActorRatio = async () => {
    if (!row.department) {
      return;
    }

    try {
      // Use the first value from projectNames state array
      const projectName = projectNames.length > 0 ? projectNames[0] : "";
      
      if (!projectName) {
        console.log("Missing project name");
        return;
      }

      // Special designations list
      const specialDesignations = ["TPO", "Principal", "TCAPO", "ESI", "Instructor"];
      
      // Count designations from the response data
      const designationCounts = {};
      
      // Log raw designations for debugging
      console.log("Raw designations array:", designations);
      
      // Count each designation type from the values array
      if (Array.isArray(designations)) {
        designations.forEach(designation => {
          // Skip empty designations
          if (!designation) return;
          
          // Categorize as special designation or Faculty
          const category = specialDesignations.includes(designation) ? designation : "Faculty";
          designationCounts[category] = (designationCounts[category] || 0) + 1;
        });
      }
      
      console.log("Designation counts:", designationCounts);
      
      // Ensure we have TPO and Principal in the counts
      if (designations.includes("TPO") && !designationCounts["TPO"]) {
        designationCounts["TPO"] = designations.filter(d => d === "TPO").length;
      }
      
      if (designations.includes("Principal") && !designationCounts["Principal"]) {
        designationCounts["Principal"] = designations.filter(d => d === "Principal").length;
      }
      
      console.log("Final designation counts:", designationCounts);
      
      // Calculate total students based on each designation type
      let totalStudents = 0;
      let totalRatios = {};
      let promises = [];
      
      // List of designations we'll query
      const designationsToQuery = Object.keys(designationCounts);
      console.log("Designations to query:", designationsToQuery);
      
      // Prepare all API calls in parallel
      for (const designationType of designationsToQuery) {
        const count = designationCounts[designationType] || 0;
        console.log(`Preparing API call for ${designationType} with count ${count}`);
        
        if (count > 0) {
          const promise = api.post("/graphql", {
            query: GET_STUDENT_SYSTEM_ACTOR_RATIO,
            variables: {
              project_name: projectName,
              designations: designationType
            }
          }).then(response => {
            console.log(`API response for ${designationType}:`, response.data);
            const ratioData = response.data?.data?.studentSystemActorRatiosConnection?.values?.[0];
            
            if (ratioData && ratioData.student_system_actor_ratio) {
              return {
                designationType,
                count,
                ratio: ratioData.student_system_actor_ratio
              };
            }
            console.log(`No ratio found for ${designationType}`);
            return null;
          }).catch(error => {
            console.error(`Error fetching ratio for ${designationType}:`, error);
            return null;
          });
          
          promises.push(promise);
        }
      }
      
      console.log(`Created ${promises.length} API call promises`);
      
      // Wait for all API calls to complete
      const results = await Promise.all(promises);
      console.log("API call results:", results);
      
      // Process results
      for (const result of results) {
        if (result) {
          const { designationType, count, ratio } = result;
          totalRatios[designationType] = ratio;
          
          // Calculate students for this designation type
          const studentsForThisType = count * ratio;
          totalStudents += studentsForThisType;
          
          console.log(`${designationType}: ${count} × ${ratio} = ${studentsForThisType}`);
        }
      }
      
      console.log("Total students calculation:", totalStudents);
      
      // Store the ratio data for reference
      setStudentSystemActorRatio({ 
        student_system_actor_ratio: totalRatios,
        project_name: projectName
      });
      
      // Update the students count
      if (totalStudents > 0 && !row.students) {
        const roundedStudents = Math.round(totalStudents);
        updateRow(row.id, "students", roundedStudents);
      }
    } catch (error) {
      console.error("Error calculating students from ratios:", error);
      setStudentSystemActorRatio(null);
    }
  };

  const fetchFacultyCount = async () => {
    if (!row.start_date || !row.end_date || !row.state) {
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
      
      setDesignations(designationsArray);
      setProjectNames(projectNamesArray);
      
      // Log the arrays for debugging
      console.log("Designations:", designationsArray);
      console.log("Project Names:", projectNamesArray);

      // If we have designations and project names, set the first ones as default
      if (designationsArray.length > 0 && !row.designation) {
        updateRow(row.id, "designation", designationsArray[0]);
      }
      
      if (projectNamesArray.length > 0 && !row.project_name) {
        updateRow(row.id, "project_name", projectNamesArray[0]);
      }

      return response.data?.data?.usersTotsConnection?.aggregate?.count || 0;
    } catch (error) {
      console.error("Error fetching faculty count:", error);
      return 0;
    }
  };

  // Memoized faculty options with count
  const facultyOptions = useMemo(() => {
    return [
      {
        value: "Faculty",
        label: `Faculty (${row.facultyCount || 0})`,
      },
    ];
  }, [row.facultyCount]);

  // Function to trigger when filters change
  const updateFacultyCount = async () => {
    if (row.start_date && row.end_date && row.state) {
      const count = await fetchFacultyCount();
      // updateRow(row.id, "facultyCount", count);
    }
  };

  // Call updateFacultyCount when relevant filters change
  useEffect(() => {
    const fetchCount = async () => {
      if (row.start_date && row.end_date && row.state && row.department) {
        const count = await fetchFacultyCount();
        updateRow(row.id, "facultyCount", count);
      }
    };
    fetchCount();
  }, [row.start_date, row.end_date, row.state, row.department]);

  // Call fetchStudentSystemActorRatio when faculty is selected and we have designations/projectNames
  useEffect(() => {
    if (row.faculty && designations.length > 0 && projectNames.length > 0) {
      fetchStudentSystemActorRatio();
    }
  }, [row.faculty, designations, projectNames]);

  return (
    <tr key={row.id}>
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

      {/* Faculty dropdown */}
      <td>
        <Select
          className={`table-input ${errors.faculty ? "border-red" : ""}`}
          classNamePrefix="select"
          isClearable={true}
          name="faculty"
          options={facultyOptions}
          value={facultyOptions.find((option) => option.value === row.faculty)}
          onChange={(selectedOption) => {
            updateRow(row.id, "faculty", selectedOption?.value || "");
            setErrors((prevErrors) => ({ ...prevErrors, faculty: "" }));
          }}
          isDisabled={!row.facultyCount} // Disable if no faculty count
        />
        {errors.faculty && <span className="error">{errors.faculty}</span>}
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

// eslint-disable-next-line import/no-anonymous-default-export
export default StudentOutreachRowdata;