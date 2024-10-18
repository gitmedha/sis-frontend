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
    return await api.post('/graphql', {
      query: CREATE_LATEST_ACTIVITY,
      variables: {data},
    }).then(data => {
      return data;
    }).catch(error => {
      return Promise.reject(error);
    });
  };


 



 
  function formatDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth is zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
 export function compareObjects(obj1, obj2) {
    const differences = {};
  
    for (let key in obj1) {
      let value1 = obj1[key];
      let value2 = obj2[key];
  
      // Handle date comparison in 'dd-mm-yyyy' format
      if (key === 'start_date' || key === 'fee_submission_date') {
        value1 = formatDate(value1);
        value2 = formatDate(value2);
      }
  
      // Handle assigned_to comparison by 'id'
      if (key === 'assigned_to') {
        if (typeof value1 === 'object' && value1 !== null && 'id' in value1) {
          value1 = value1.id;
        }
      }
  
      // Compare student.full_name from obj1 with alumni_service_student from obj2 (case-insensitive)
      if (key === 'student') {
        const studentFullName = value1?.full_name?.toLowerCase();
        const alumniServiceStudent = obj2.alumni_service_student?.toLowerCase();
        if (studentFullName !== alumniServiceStudent) {
          differences['alumni_service_student'] = { obj1: value1.full_name, obj2: obj2.alumni_service_student };
        }
      }
  
      // Compare other fields
      if (typeof value1 === 'string' && typeof value2 === 'string') {
        // Perform case-insensitive comparison for strings
        if (value1.toLowerCase() !== value2.toLowerCase()) {
          differences[key] = { obj1: value1, obj2: value2 };
        }
      } else if (value1 !== value2 && key !== 'student') {
        differences[key] = { obj1: value1, obj2: value2 };
      }
    }
  
    // Check for keys present in obj2 but not in obj1
    for (let key in obj2) {
      if (!(key in obj1) && key !== 'alumni_service_student') {
        differences[key] = { obj1: undefined, obj2: obj2[key] };
      }
    }
  
    return differences;
  }