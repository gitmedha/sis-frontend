import { useEffect } from 'react';
import api from '../../../../../apis';
import { GET_MALE_FEMALE_RATIO } from '../../../../../graphql/operations';

const useMaleFemaleData = (
  category,
  projectNames,
  updateRow,
  students // Add students parameter to get the total count
) => {
  useEffect(() => {
    // Only run for Student Outreach category and when we have project names
    if (category === "Student Outreach" && projectNames && projectNames.length > 0) {
      const projectName = projectNames[0]; // Get the first project name
      
      const fetchMaleFemaleData = async () => {
        try {
          // First, check if we have a valid project name
          if (!projectName) {
            console.warn("No project name available for male/female calculation");
            return;
          }
          
          console.log("Fetching male/female data for project:", projectName);
          
          // Fetch male/female ratio data
          const response = await api.post("/graphql", {
            query: GET_MALE_FEMALE_RATIO,
            variables: {
              project_name: projectName
            },
          });
          
          // Extract data from response
          const values = response.data?.data?.studentSystemActorRatiosConnection?.values || [];
          
          if (values.length > 0) {
            // Get the first object from the array
            const { male: malePercentage, female: femalePercentage } = values[0];
            
            if (!isNaN(malePercentage) && !isNaN(femalePercentage) && students > 0) {
              // Convert percentages to actual numbers and round to nearest whole number
              const maleValue = Math.round((malePercentage / 100) * students);
              const femaleValue = Math.round((femalePercentage / 100) * students);
              
              console.log(`Calculated male/female numbers for ${projectName}:`, {
                students,
                malePercentage,
                femalePercentage,
                maleValue,
                femaleValue
              });
              
              // Update the row with the calculated values
              updateRow("male", maleValue);
              updateRow("female", femaleValue);
            } else {
              console.warn(`Invalid male/female percentages or students count for ${projectName}`);
              // Set default values if values are invalid
              updateRow("male", 0);
              updateRow("female", 0);
            }
          } else {
            console.warn(`No male/female data found for project: ${projectName}`);
            // Set default values if no data found
            updateRow("male", 0);
            updateRow("female", 0);
          }
        } catch (error) {
          console.error("Error fetching male/female data:", error);
          // Set default values on error
          updateRow("male", 0);
          updateRow("female", 0);
        }
      };
      
      // Fetch data with a slight delay to ensure projectNames has been populated
      const timerId = setTimeout(() => {
        fetchMaleFemaleData();
      }, 300);
      
      // Clean up timeout
      return () => clearTimeout(timerId);
    }
  }, [category, projectNames, students]); // Add students to dependency array
  
  return null; // This hook doesn't need to return anything
};

export default useMaleFemaleData; 