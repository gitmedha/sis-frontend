import { useEffect } from 'react';
import api from '../../../../../apis';
import { GET_STUDENT_SYSTEM_ACTOR_RATIO } from '../../../../../graphql/operations';

const useStudentData = (
  faculty, 
  category, 
  department, 
  designations, 
  projectNames, 
  updateRow, 
  setRows, 
  setIsSaveDisabled
) => {
  // Calculate students based on faculty data
  const calculateStudents = async () => {
    const facultyNum = Number(faculty);

    // Immediately exit if faculty is 0 or not positive
    if (facultyNum <= 0) {
      return;
    }

    if (!department || !projectNames[0]) {
      return;
    }

    try {
      // Special designations list
      const specialDesignations = [
        "TPO",
        "Principal",
        "TCAPO",
        "ESI",
        "Instructor",
      ];

      // Count designations from the response data
      const designationCounts = {};

      // Count each designation type from the values array
      if (Array.isArray(designations)) {
        designations.forEach((designation) => {
          // Skip empty designations
          if (!designation) {
            return;
          }

          // Categorize as special designation or Faculty
          const category = specialDesignations.includes(designation)
            ? designation
            : "Faculty";
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
          const promise = api
            .post("/graphql", {
              query: GET_STUDENT_SYSTEM_ACTOR_RATIO,
              variables: {
                project_name: projectNames[0],
                designations: designationType,
              },
            })
            .then((response) => {
              // Extract values array
              const values =
                response.data?.data?.studentSystemActorRatiosConnection
                  ?.values || [];

              if (values.length > 0) {
                const ratioData = values[0];

                // If we found an institution_type, store it
                if (ratioData.institution_type) {
                  foundInstitutionType = ratioData.institution_type;
                }

                if (ratioData.student_system_actor_ratio) {
                  // Parse ratio as a number to ensure it's valid
                  const parsedRatio = parseFloat(
                    ratioData.student_system_actor_ratio
                  );

                  if (!isNaN(parsedRatio) && parsedRatio > 0) {
                    return {
                      designationType,
                      count,
                      ratio: parsedRatio,
                      institution_type: ratioData.institution_type || "",
                    };
                  } else {
                    console.warn(
                      `Invalid ratio value for ${designationType}: ${ratioData.student_system_actor_ratio}`
                    );
                  }
                } else {
                  console.warn(
                    `No student_system_actor_ratio field found for ${designationType}`
                  );
                }
              } else {
                console.warn(`No ratio data found for ${designationType}`);
              }

              return null;
            })
            .catch((error) => {
              console.error(
                `Error fetching ratio for ${designationType}:`,
                error
              );
              return null;
            });

          promises.push(promise);
        }
      }

      // Wait for all API calls to complete
      const results = await Promise.all(promises);

      let anyValidRatioFound = false;

      // Check if we have any valid ratio results
      const validResults = results.filter((result) => result !== null);
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

          if (
            !isNaN(studentsForThisType) &&
            isFinite(studentsForThisType) &&
            studentsForThisType > 0
          ) {
            anyValidRatioFound = true;
            totalStudents += studentsForThisType;
          } else {
            console.warn(
              `Invalid student calculation for ${designationType}: ${count} × ${ratio} = ${studentsForThisType}`
            );
          }
        }
      }

      // Always update the student count, even if it's zero
      // But only if we actually got data from the API
      if (anyValidRatioFound || results.length > 0) {
        const roundedStudents =
          totalStudents > 0 ? Math.round(totalStudents) : 0;

        // Always update the student count regardless of value
        updateRow("students", roundedStudents);

        // Create a local variable to track the expected update
        const studentUpdatePromise = new Promise((resolve) => {
          // Wait slightly to allow state update
          setTimeout(() => {
            resolve();
          }, 100);
        });

        await studentUpdatePromise;
      }

      // Update institution type if available
      if (foundInstitutionType) {
        updateRow("institution_type", foundInstitutionType);
      }
      
      return { totalStudents, foundInstitutionType };
    } catch (error) {
      console.error("Error calculating students from ratios:", error);
      return { totalStudents: 0, foundInstitutionType: "" };
    }
  };

  // Effect to handle faculty count changes
  useEffect(() => {
    const facultyNum = Number(faculty);

    // If faculty is 0 and category is "Student Outreach", reset students and disable save button
    if (facultyNum === 0 && category === "Student Outreach") {
      console.log("Faculty is zero for Student Outreach, resetting student values");
      // Use setRows to directly update the state in the parent component
      setRows((prevRows) =>
        prevRows.map((prevRow) => ({
          ...prevRow,
          students: 0,
          institution_type: "",
        }))
      );
      // Disable the save button when faculty is 0 for Student Outreach
      if (setIsSaveDisabled) {
        setIsSaveDisabled(true);
      }
      return;
    } else if (setIsSaveDisabled && category === "Student Outreach") {
      // Enable the save button when faculty is not 0 for Student Outreach
      setIsSaveDisabled(false);
    } else if (setIsSaveDisabled && category !== "Student Outreach") {
      // For non-Student Outreach, don't disable save button based on faculty
      setIsSaveDisabled(false);
    }

    // Only run if faculty is positive and all dependencies exist
    if (
      facultyNum > 0 &&
      category === "Student Outreach" &&
      department &&
      designations.length > 0 &&
      projectNames.length > 0
    ) {
      const fetchData = async () => {
        try {
          // Double-check faculty is still positive before fetching
          if (Number(faculty) <= 0) return;
          
          // Fetch student data
          await calculateStudents();
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };

      // Add a small delay to ensure all state updates have processed
      const timerId = setTimeout(() => {
        fetchData();
      }, 200);

      // Clean up timeout on unmount or when dependencies change
      return () => clearTimeout(timerId);
    }
  }, [faculty, category, department, designations, projectNames, setIsSaveDisabled]);

  return { calculateStudents };
};

export default useStudentData; 