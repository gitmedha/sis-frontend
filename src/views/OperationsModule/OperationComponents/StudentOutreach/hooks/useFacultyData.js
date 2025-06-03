import { useState, useEffect } from 'react';
import api from '../../../../../apis';
import { COUNT_USERS_TOTS } from '../../../../../graphql/operations';

const useFacultyData = (startDate, endDate, state, department, updateRow, setIsSaveDisabled) => {
  const [designations, setDesignations] = useState([]);
  const [projectNames, setProjectNames] = useState([]);

  // Fetch faculty count based on filters
  const fetchFacultyCount = async () => {
    try {
      const response = await api.post("/graphql", {
        query: COUNT_USERS_TOTS,
        variables: {
          startDate,
          endDate,
          state,
          dept: department || null,
        },
      });
      // Extract designations and project names from the response
      const designationsArray =
        response.data?.data?.usersTotsConnection?.values?.map(
          (item) => item.designation
        ) || [];
      const projectNamesArray =
        response.data?.data?.usersTotsConnection?.values?.map(
          (item) => item.project_name
        ) || [];

      // Update state only if we have values
      if (designationsArray.length > 0) {
        setDesignations(designationsArray);
      } else {
        setDesignations([]);
      }

      if (projectNamesArray.length > 0) {
        setProjectNames(projectNamesArray);
      } else {
        setProjectNames([]);
      }

      const count =
        response.data?.data?.usersTotsConnection?.aggregate?.count || 0;

      return { count, designationsArray, projectNamesArray };
    } catch (error) {
      console.error("Error fetching faculty count:", error);
      return { count: 0, designationsArray: [], projectNamesArray: [] };
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (startDate && endDate && state && department) {
          const { count } = await fetchFacultyCount();
          updateRow("faculty", count);
          
          // If count is 0, update related fields
          if (count === 0) {
            setDesignations([]);
            setProjectNames([]);
            
            // Disable save button if needed
            if (setIsSaveDisabled) {
              setIsSaveDisabled(true);
            }
          }
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Faculty count error:", error);
        }
      }
    };

    fetchCount();
  }, [startDate, endDate, state, department]);

  return { designations, projectNames, fetchFacultyCount };
};

export default useFacultyData; 