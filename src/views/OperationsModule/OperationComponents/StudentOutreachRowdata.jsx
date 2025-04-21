import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { COUNT_USERS_TOTS, GET_STUDENT_SYSTEM_ACTOR_RATIO } from "../../../graphql/operations"; // Added new import
import api from "../../../apis";

const StudentOutreachRowdata = ({ row, updateRow, setRows }) => {
  const [errors, setErrors] = useState({});
  const [designations, setDesignations] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [studentSystemActorRatio, setStudentSystemActorRatio] = useState(null);
  const [localFacultyCount, setLocalFacultyCount] = useState(0);
  const [localStudentCount, setLocalStudentCount] = useState(0);

  // Initialize localStudentCount when row.students changes outside this component
  useEffect(() => {
    console.log("row.students changed externally:", row.students);
    
    // Only update localStudentCount from row.students during initialization
    // or when localStudentCount is 0 (to prevent overwriting calculated values)
    if (row.students !== undefined && localStudentCount === 0) {
      console.log("Updating localStudentCount from row.students:", row.students);
      setLocalStudentCount(row.students);
    } else {
      console.log("Not updating localStudentCount - current value:", localStudentCount);
    }
  }, [row.students]);

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
    console.log("FETCH STUDENT RATIO - Starting with params:", {
      department: row.department,
      projectNames: projectNames,
      faculty: row.faculty,
      designations: designations
    });
    
    if (!row.department || !projectNames[0]) {
      console.log("Missing department or project name, skipping ratio fetch");
      return;
    }

    try {
      console.log("Fetching student ratios with params:", {
        project_name: projectNames[0],
        department: row.department,
        start_date: row.start_date,
        end_date: row.end_date,
        state: row.state
      });
      
      // Special designations list
      const specialDesignations = ["TPO", "Principal", "TCAPO", "ESI", "Instructor"];
      
      // Count designations from the response data
      const designationCounts = {};
      
      // Count each designation type from the values array
      if (Array.isArray(designations)) {
        console.log("Processing designations:", designations);
        
        // Log unique designations for debugging
        const uniqueDesignations = [...new Set(designations)];
        console.log("Unique designations found:", uniqueDesignations);
        
        designations.forEach(designation => {
          // Skip empty designations
          if (!designation) {
            console.log("Skipping empty designation");
            return;
          }
          
          // Categorize as special designation or Faculty
          const category = specialDesignations.includes(designation) ? designation : "Faculty";
          console.log(`Designation "${designation}" categorized as "${category}"`);
          
          designationCounts[category] = (designationCounts[category] || 0) + 1;
        });
        
        // If "Faculty" was selected but no faculty designations found, add a default count of 1
        if (row.faculty === "Faculty" && !designationCounts["Faculty"]) {
          console.log("Faculty was selected but no faculty designations found in API data, adding default count of 1");
          designationCounts["Faculty"] = 1;
        }
      }
      
      console.log("Designation counts calculated:", designationCounts);
      
      // Calculate total students based on each designation type
      let totalStudents = 0;
      let totalRatios = {};
      let foundInstitutionType = "";
      let promises = [];
      
      // List of designations we'll query
      const designationsToQuery = Object.keys(designationCounts);
      console.log("Designations to query:", designationsToQuery);
      
      // Prepare all API calls in parallel
      for (const designationType of designationsToQuery) {
        const count = designationCounts[designationType] || 0;
        
        if (count > 0) {
          console.log(`Sending API request for ${designationType} with count ${count}`);
          const promise = api.post("/graphql", {
            query: GET_STUDENT_SYSTEM_ACTOR_RATIO,
            variables: {
              project_name: projectNames[0],
              designations: designationType
            }
          }).then(response => {
            console.log(`Full response for ${designationType}:`, JSON.stringify(response.data));
            
            // Extract values array
            const values = response.data?.data?.studentSystemActorRatiosConnection?.values || [];
            console.log(`Found ${values.length} ratio values for ${designationType}`);
            
            if (values.length > 0) {
              const ratioData = values[0];
              console.log(`Detailed ratio data for ${designationType}:`, ratioData);
              
              // If we found an institution_type, store it
              if (ratioData.institution_type) {
                foundInstitutionType = ratioData.institution_type;
                console.log("Found institution type:", foundInstitutionType);
              }
              
              if (ratioData.student_system_actor_ratio) {
                // Parse ratio as a number to ensure it's valid
                const parsedRatio = parseFloat(ratioData.student_system_actor_ratio);
                
                if (!isNaN(parsedRatio) && parsedRatio > 0) {
                  console.log(`Valid ratio found for ${designationType}: ${parsedRatio}`);
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
      console.log("All API results:", results);
      
      // Process results
      console.log("Processing API results:", results);
      let anyValidRatioFound = false;

      // Check if we have any valid ratio results
      const validResults = results.filter(result => result !== null);
      console.log(`Found ${validResults.length} valid results out of ${results.length} total`);

      // If we have Faculty selected but no valid Faculty ratio, use a default ratio
      if (row.faculty === "Faculty" && 
          !validResults.some(r => r && r.designationType === "Faculty") && 
          designationCounts["Faculty"] > 0) {
        console.log("No valid Faculty ratio found but Faculty is selected - using default ratio of 30");
        
        // Add a synthetic result for Faculty with a reasonable default ratio
        validResults.push({
          designationType: "Faculty",
          count: designationCounts["Faculty"],
          ratio: 30, // Default ratio of 30 students per faculty
          institution_type: row.department.includes("Higher Education") ? "University" : "College"
        });
        
        console.log("Added default Faculty ratio:", validResults[validResults.length - 1]);
      }

      for (const result of validResults) {
        if (result) {
          const { designationType, count, ratio, institution_type } = result;
          console.log(`Processing result for ${designationType}:`, { count, ratio, institution_type });
          totalRatios[designationType] = ratio;
          
          // If we found an institution_type and haven't set one yet, use this one
          if (institution_type && !foundInstitutionType) {
            foundInstitutionType = institution_type;
          }
          
          // Calculate students for this designation type
          const studentsForThisType = count * ratio;
          console.log(`Calculated ${studentsForThisType} students for ${designationType} (${count} × ${ratio})`);
          
          if (!isNaN(studentsForThisType) && isFinite(studentsForThisType) && studentsForThisType > 0) {
            anyValidRatioFound = true;
            totalStudents += studentsForThisType;
          } else {
            console.warn(`Invalid student calculation for ${designationType}: ${count} × ${ratio} = ${studentsForThisType}`);
          }
        }
      }
      
      console.log("Total students calculated:", totalStudents, "Any valid ratio found:", anyValidRatioFound);
      
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
        console.log("Setting student count based on calculation:", roundedStudents);
        
        // Update both row state and local state
        // But avoid needlessly setting to zero if we already have a value
        if (roundedStudents > 0 || localStudentCount === 0) {
          console.log("Updating student count to:", roundedStudents);
          setLocalStudentCount(roundedStudents);
          updateRow("students", roundedStudents);
        } else {
          console.log("Keeping existing student count:", localStudentCount, "instead of setting to zero");
        }
        
        // Create a local variable to track the expected update
        const studentUpdatePromise = new Promise(resolve => {
          // Wait slightly to allow state update
          setTimeout(() => {
            console.log("After student update, values are - row.students:", row.students, "localStudentCount:", localStudentCount); 
            resolve();
          }, 100);
        });
        
        await studentUpdatePromise;
      } else {
        console.log("No valid student ratio found, not updating student count");
      }
      
      // Update institution type if available, or clear it if not found
      if (foundInstitutionType) {
        console.log("Setting institution type to:", foundInstitutionType);
        updateRow("institution_type", foundInstitutionType);
      } else {
        console.log("No institution type found, clearing field");
        updateRow("institution_type", "");
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
      
      // Reset faculty-related fields
      updateRow("faculty", "");
      updateRow("facultyCount", 0);
      
      // Explicitly reset student count
      setLocalStudentCount(0);
      updateRow("students", 0);
      updateRow("institution_type", "");
      
      return 0;
    }

    try {
      console.log("Fetching faculty count from API...");
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
      
      console.log("API returned designations:", designationsArray);
      console.log("API returned projectNames:", projectNamesArray);
      
      // Update state only if we have values
      if (designationsArray.length > 0) {
        setDesignations(designationsArray);
      } else {
        setDesignations([]);
        // No designations means no faculty
        updateRow("faculty", "");
      }
      
      if (projectNamesArray.length > 0) {
        setProjectNames(projectNamesArray);
      } else {
        setProjectNames([]);
        // No project names means no faculty
        updateRow("faculty", "");
      }
      
      const count = response.data?.data?.usersTotsConnection?.aggregate?.count || 0;
      console.log("Faculty count from API:", count);
      
      // If count is 0, clear faculty selection and student count
      if (count === 0) {
        updateRow("faculty", "");
        // Explicitly reset student count when faculty count is zero
        setLocalStudentCount(0);
        updateRow("students", 0);
        updateRow("institution_type", "");
      }
      
      return count;
    } catch (error) {
      console.error("Error fetching faculty count:", error);
      // Reset values on error
      setDesignations([]);
      setProjectNames([]);
      updateRow("faculty", "");
      // Explicitly reset student count on error
      setLocalStudentCount(0);
      updateRow("students", 0);
      updateRow("institution_type", "");
      return 0;
    }
  };

  // Memoized faculty options with count
  const facultyOptions = useMemo(() => {
    console.log("Updating faculty options with count:", localFacultyCount);
    console.log("Faculty count type:", typeof localFacultyCount);
    console.log("Is faculty dropdown disabled?", !localFacultyCount || localFacultyCount <= 0);
    return [
      {
        value: "Faculty",
        label: `Faculty (${localFacultyCount || 0})`,
      },
    ];
  }, [localFacultyCount]);

  // Call fetchFacultyCount when relevant filters change
  useEffect(() => {
    console.log("Department/State/Date dependencies changed, updating faculty count");
    console.log("Current dependencies:", {
      start_date: row.start_date,
      end_date: row.end_date,
      state: row.state,
      department: row.department
    });
    
    const fetchCount = async () => {
      if (row.start_date && row.end_date && row.state && row.department) {
        const count = await fetchFacultyCount();
        console.log(`Faculty count updated to ${count}, type: ${typeof count}`);
        
        // Update faculty count state
        setLocalFacultyCount(count);
        updateRow("facultyCount", count);
        
        console.log("After updateRow call, facultyCount:", row.facultyCount);
        
        // Auto-select Faculty if count is greater than 0 and faculty is not already selected
        if (count > 0 && !row.faculty) {
          console.log("Auto-selecting Faculty since we have faculty count");
          console.log("Current student count:", localStudentCount);
          
          // Important: Don't reset student count when auto-selecting faculty
          const currentStudentCount = localStudentCount;
          
          updateRow("faculty", "Faculty");
          
          // If we had a non-zero student count, restore it 
          // This prevents auto-faculty selection from resetting the student count
          if (currentStudentCount > 0) {
            console.log("Preserving existing student count:", currentStudentCount);
            setTimeout(() => {
              setLocalStudentCount(currentStudentCount);
              updateRow("students", currentStudentCount);
            }, 100);
          }
        }
      }
    };
    fetchCount();
  }, [row.start_date, row.end_date, row.state, row.department]);

  // Trigger fetch when faculty is selected or any required parameter changes
  useEffect(() => {
    console.log("Dependencies changed - current state:", {
      faculty: row.faculty,
      facultyCount: localFacultyCount,
      start_date: !!row.start_date,
      end_date: !!row.end_date,
      state: !!row.state,
      department: !!row.department,
      studentCount: localStudentCount
    });
    
    // ONLY reset values if faculty is specifically deselected or removed
    // Don't reset when other dependencies change
    if (!row.faculty) {
      console.log("Faculty deselected or not set, clearing student count");
      setLocalStudentCount(0);
      updateRow("students", 0);
      updateRow("institution_type", "");
      return;
    }
    
    // Only trigger new data fetch if we have all dependencies
    if (row.faculty && 
        row.start_date && row.end_date && 
        row.state && row.department && 
        designations.length > 0 && projectNames.length > 0) {
      
      console.log("All dependencies present, triggering student data fetch");
      
      // Use a slight delay to ensure the faculty value is processed
      setTimeout(() => {
        fetchStudentSystemActorRatio();
      }, 200);
    } else {
      console.log("Not all dependencies available for student data fetch");
    }
  }, [row.faculty, row.start_date, row.end_date, row.state, row.department, designations.length, projectNames.length]);

  // Add a useEffect to ensure student count is zero when faculty count is zero
  useEffect(() => {
    console.log("Faculty count changed:", localFacultyCount);
    
    // If faculty count is zero or not present, ensure student count is also zero
    if (localFacultyCount === 0) {
      console.log("Faculty count is zero, resetting student count to zero");
      setLocalStudentCount(0);
      updateRow("students", 0);
    }
  }, [localFacultyCount]);

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
        <Select
          className={`table-input ${errors.faculty ? "border-red" : ""}`}
          classNamePrefix="select"
          isClearable={true}
          name="faculty"
          options={facultyOptions}
          value={facultyOptions.find((option) => option.value === row.faculty)}
          onChange={(selectedOption) => {
            const facultyValue = selectedOption ? selectedOption.value : "";
            console.log("Faculty selected manually:", facultyValue, "current student count:", localStudentCount);
            
            // Reset faculty-related fields when deselected
            if (!facultyValue) {
              console.log("Faculty deselected, clearing related fields");
              updateRow("faculty", "");
              // Always reset student count when faculty is deselected
              setLocalStudentCount(0);
              updateRow("students", 0);
              updateRow("institution_type", "");
              setErrors((prevErrors) => ({ ...prevErrors, faculty: "" }));
              return;
            }
            
            // Set faculty value
            updateRow("faculty", facultyValue);
            setErrors((prevErrors) => ({ ...prevErrors, faculty: "" }));
            
            // If faculty count is zero, ensure student count is also zero
            if (localFacultyCount === 0) {
              console.log("Faculty selected but count is zero, ensuring student count is zero");
              setLocalStudentCount(0);
              updateRow("students", 0);
              return;
            }
            
            // If we have all required data, trigger the fetch
            if (
              designations.length > 0 && 
              projectNames.length > 0 &&
              row.start_date &&
              row.end_date &&
              row.state && 
              row.department
            ) {
              console.log("All dependencies available, fetching student data immediately");
              setTimeout(() => {
                fetchStudentSystemActorRatio();
              }, 200);
            } else {
              console.log("Cannot fetch student data, missing dependencies");
            }
          }}
          // Use localFacultyCount instead of row.facultyCount
          isDisabled={!localFacultyCount || localFacultyCount <= 0}
        />
        {console.log("Faculty render - localFacultyCount:", localFacultyCount, "row.facultyCount:", row.facultyCount, "disabled:", !localFacultyCount || localFacultyCount <= 0)}
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
          value={localStudentCount !== null ? localStudentCount : row.students}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10) || 0;
            setLocalStudentCount(newValue);
            handleInputChange("students", newValue);
          }}
        />
        {console.log("Students render - localStudentCount:", localStudentCount, "row.students:", row.students)}
        {errors.students && <span className="error">{errors.students}</span>}
      </td>
    </tr>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default StudentOutreachRowdata;