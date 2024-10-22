import api from "src/apis";
import { CREATE_LATEST_ACTIVITY, GET_ALL_LATEST_ACTIVITY } from "src/graphql/latestActivity";

export const getActivity = async (id) => {
    return await api.post("/graphql", {
      query: GET_ALL_LATEST_ACTIVITY,
      variables: {
        id
      },
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      return Promise.reject(error);
    });
  };
  
  export const createLatestAcivity = async (data) => {
    // console.log(data);
    // return  await api.post(
    //   "/users-ops-activities/createBulkOperations",
    //   data
    // )
    try {
      const response = await api.post(
          "/latest-activities",
          data
        )
      return response;
    } catch (error) {
      return console.error(error);
    }
  };


 
  function formatDate(date) {
    if (typeof date === 'string') {
      // Attempt to parse the date string into a Date object
      let parsedDate = new Date(date);
      
      // Check if the parsed date is valid
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];  // Return "YYYY-MM-DD" format
      }
    }
    return date;  // Return as is if not a string
  }
  
 export function findDifferences(obj1, obj2) {
    let differences = {};
  
    // Compare only the start_date and end_date
    const dateKeys = ['start_date', 'end_date'];
  
    dateKeys.forEach(key => {
      let formattedDate1 = formatDate(obj1[key]);
      let formattedDate2 = formatDate(obj2[key]);
  
      if (formattedDate1 !== formattedDate2) {
        differences[key] = {
          previous_value: formattedDate1,
          new_value: formattedDate2
        };
      }
    });
  
    // Compare all other fields
    for (let key in obj1) {
      if (!dateKeys.includes(key)) {
        if (key === 'assigned_to') {
          // Compare the ID directly for assigned_to
          let assignedToId1 = obj1[key].id; // Get the ID from the nested object
          if (assignedToId1 !== obj2[key]) {
            differences[key] = {
              previous_value: obj1[key],
              new_value: obj2[key] // This is a string (ID)
            };
          }
        }else if (key === 'student') {
          // Compare the full_name in the student object
          if (obj1[key].full_name !== obj2[key].full_name) {
            differences[key] = {
              previous_value: obj1[key].full_name,
              new_value: obj2[key].full_name
            };
          }
        } 
        else if (obj1[key] !== obj2[key]) {
          // For other fields, compare values directly
          differences[key] = {
            previous_value: obj1[key] !== undefined ? obj1[key] : null,
            new_value: obj2[key]
          };
        }
      }
    }
  
    // Check for keys in obj2 that are not in obj1
    for (let key in obj2) {
      if (!(key in obj1)) {
        differences[key] = {
          previous_value: undefined,
          new_value: obj2[key]
        };
      }
    }
  
    return differences;
  }