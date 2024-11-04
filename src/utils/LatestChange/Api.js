import api from "src/apis";
import { CREATE_LATEST_ACTIVITY, GET_ALL_LATEST_ACTIVITY } from "src/graphql/latestActivity";
export const getActivity = async (data) => {
    try {
      const response = await api.get(
          "/latest-activities",
          data
        )
      return response;
    } catch (error) {
      return console.error(error);
    }
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
function formatDate(dateString) {
  // Check if dateString is a valid string before calling .includes
  if (typeof dateString !== "string") return null;

  // Extract the date part from an ISO string or return as-is if it's in "YYYY-MM-DD" format
  return dateString.includes("T") ? dateString.split("T")[0] : dateString;
}


export function findEnrollmentDifferences(obj1, obj2) {
  const differences = {};

  // Define a helper function to format dates
  const formatDate = (date) => {
      if (!date) return null; // Handle null values
      return new Date(date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Compare values while ignoring certain fields
  const compareFields = (fieldName, value1, value2) => {
      if (value1 !== value2) {
          differences[fieldName] = {
              previous_value: value1,
              new_value: value2,
          };
      }
  };

  // Compare course fields
  compareFields('course_level', obj1.course_level, obj2.course_level);
  compareFields('registration_date', formatDate(obj1.registration_date), formatDate(obj2.registration_date));
  compareFields('certification_date', formatDate(obj1.certification_date), formatDate(obj2.certification_date));
  compareFields('course_name_in_current_sis', obj1.course_name_in_current_sis, obj2.course_name_in_current_sis);
  compareFields('course_name_other', obj1.course_name_other, obj2.course_name_other);

  // Compare institution if IDs are different
  console.log(obj2);
  if (String(obj1.institution.id) !== String(obj2.institution)) {
      differences.institution = {
          previous_value: { id: obj1.institution.id, name: obj1.institution.name },
          new_value: obj2.institution,
      };
  }

  // Compare batch if IDs are different
  if (String(obj1.batch.id) !== String(obj2.batch)) {
      differences.batch = {
          previous_value: { id: obj1.batch.id, name: obj1.batch.name, program: obj1.batch.program },
          new_value: obj2.batch,
      };
  }
  console.log(differences);
  return differences;
}

export function findEmployerDifferences(obj1, obj2) {
  const differences = {};

  // Compare employer_id if IDs are different
  if (String(obj2.employer_id) !== String(obj1.opportunity.employer.id)) {
      differences.employer_id = {
          previous_value: { id: obj1.opportunity.employer.id, name: obj1.employer },
          new_value: obj2.employer_id,
      };
  }

  // Compare assigned_to if IDs are different
  if (String(obj1.assigned_to.id) !== String(obj2.assigned_to)) {
      differences.assigned_to = {
          previous_value: obj1.assigned_to,
          new_value: obj2.assigned_to,
      };
  }

  // Compare status
  if (obj1.status !== obj2.status) {
      differences.status = {
          previous_value: obj1.status,
          new_value: obj2.status,
      };
  }

  // Compare start_date
  const newStartDate = new Date(obj2.start_date);
  const formattedNewStartDate = newStartDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
  });

  if (formattedNewStartDate !== obj1.start_date) {
      differences.start_date = {
          previous_value: obj1.start_date,
          new_value: formattedNewStartDate,
      };
  }

  // Compare end_date
  if (obj1.end_date !== obj2.end_date) {
      differences.end_date = {
          previous_value: obj1.end_date,
          new_value: obj2.end_date,
      };
  }

  // Compare source
  if (obj1.source !== obj2.source) {
      differences.source = {
          previous_value: obj1.source,
          new_value: obj2.source,
      };
  }

  // Compare salary_offered
  if (obj1.salary_offered !== obj2.salary_offered) {
      differences.salary_offered = {
          previous_value: obj1.salary_offered,
          new_value: obj2.salary_offered,
      };
  }

  // Compare number_of_internship_hours
  if (obj1.number_of_internship_hours !== obj2.number_of_internship_hours) {
      differences.number_of_internship_hours = {
          previous_value: obj1.number_of_internship_hours,
          new_value: obj2.number_of_internship_hours,
      };
  }

  // Compare experience_certificate
  if (obj1.experience_certificate !== obj2.experience_certificate) {
      differences.experience_certificate = {
          previous_value: obj1.experience_certificate,
          new_value: obj2.experience_certificate,
      };
  }

  // Compare offer_letter
  if (obj1.offer_letter !== obj2.offer_letter) {
      differences.offer_letter = {
          previous_value: obj1.offer_letter,
          new_value: obj2.offer_letter,
      };
  }

  // Compare opportunity.id
  if (obj1.opportunity.id !== obj2.opportunity_id) {
      differences.opportunity_id = {
          previous_value: obj1.opportunity.id,
          new_value: obj2.opportunity_id,
      };
  }

  // Compare registration_date_formatted
  if (obj1.registration_date_formatted !== obj2.registration_date_formatted) {
      differences.registration_date_formatted = {
          previous_value: obj1.registration_date_formatted,
          new_value: obj2.registration_date_formatted,
      };
  }

  // Log the differences
  console.log(differences);
  return differences;
}

export function findServiceStudentDifferences(obj1, obj2) {
  const differences = {};

  // Compare id
  if (obj1.id !== obj2.id) {
      differences.id = {
          previous_value: obj1.id,
          new_value: obj2.id,
      };
  }

  // Compare type
  if (obj1.type !== obj2.type) {
      differences.type = {
          previous_value: obj1.type,
          new_value: obj2.type,
      };
  }

  // Compare assigned_to if IDs are different
  if (String(obj1.assigned_to.id) !== String(obj2.assigned_to)) {
      differences.assigned_to = {
          previous_value: obj1.assigned_to,
          new_value: obj2.assigned_to,
      };
  }

  // Compare status
  if (obj1.status !== obj2.status) {
      differences.status = {
          previous_value: obj1.status,
          new_value: obj2.status,
      };
  }

  // Compare location
  if (obj1.location !== obj2.location) {
      differences.location = {
          previous_value: obj1.location,
          new_value: obj2.location,
      };
  }

  // Compare program_mode
  if (obj1.program_mode !== obj2.program_mode) {
      differences.program_mode = {
          previous_value: obj1.program_mode,
          new_value: obj2.program_mode,
      };
  }

  // Compare receipt_number
  if (obj1.receipt_number !== obj2.receipt_number) {
      differences.receipt_number = {
          previous_value: obj1.receipt_number,
          new_value: obj2.receipt_number,
      };
  }

  // Compare fee_amount
  if (obj1.fee_amount !== obj2.fee_amount) {
      differences.fee_amount = {
          previous_value: obj1.fee_amount,
          new_value: obj2.fee_amount,
      };
  }

  // Compare comments
  if (obj1.comments !== obj2.comments) {
      differences.comments = {
          previous_value: obj1.comments,
          new_value: obj2.comments,
      };
  }

  // Compare start_date (format new value for comparison)
  const newStartDate = new Date(obj2.start_date);
  const formattedNewStartDate = newStartDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
  });

  if (formattedNewStartDate !== obj1.start_date_formatted) {
      differences.start_date = {
          previous_value: obj1.start_date_formatted,
          new_value: formattedNewStartDate,
      };
  }

  // Compare end_date
  const newEndDate = new Date(obj2.end_date);
  const formattedNewEndDate = newEndDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
  });

  // Handle cases where end_date might be null
  if ((obj1.end_date && formattedNewEndDate !== obj1.end_date_formatted) ||
      (obj1.end_date === null && obj2.end_date !== null)) {
      differences.end_date = {
          previous_value: obj1.end_date_formatted,
          new_value: formattedNewEndDate,
      };
  }

  // Compare fee_submission_date (format new value for comparison)
  const newFeeSubmissionDate = new Date(obj2.fee_submission_date);
  const formattedNewFeeSubmissionDate = newFeeSubmissionDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
  });

  if (formattedNewFeeSubmissionDate !== obj1.fee_submission_date_formatted) {
      differences.fee_submission_date = {
          previous_value: obj1.fee_submission_date_formatted,
          new_value: formattedNewFeeSubmissionDate,
      };
  }

  // Compare category
  if (obj1.category !== obj2.category) {
      differences.category = {
          previous_value: obj1.category,
          new_value: obj2.category,
      };
  }

  // Compare role
  if (obj1.role !== obj2.role) {
      differences.role = {
          previous_value: obj1.role,
          new_value: obj2.role,
      };
  }

  // Compare student (if necessary)
  if (obj1.student.id !== obj2.student.id) {
      differences.student = {
          previous_value: obj1.student,
          new_value: obj2.student,
      };
  }

  // Log the differences
  console.log(differences);
  return differences;
}


export function compareObjects(obj1, obj2) {
    const differences = {};
    const excludedKeys = ["updatedby", "created_by"];

    function isDate(value) {
        return (
            (typeof value === "string" && !isNaN(Date.parse(value))) ||
            value instanceof Date
        );
    }

    function normalizeDate(value) {
        return value instanceof Date ? value : new Date(value);
    }

    for (const key in obj1) {
        if (excludedKeys.includes(key)) continue; // Skip excluded keys

        const val1 = obj1[key];
        const val2 = obj2[key];

        // Handle donor field equivalence for "Yes" and true
        if (key === "donor" && (val1 === true || val1 === "Yes") && (val2 === true || val2 === "Yes")) {
            continue; // Skip if equivalent
        }

        // Handle date comparison
        if (isDate(val1) && isDate(val2)) {
            const date1 = normalizeDate(val1);
            const date2 = normalizeDate(val2);

            if (date1.getTime() !== date2.getTime()) {
                differences[key] = { oldValue: date1, newValue: date2 };
            }
        }
        // Handle other comparisons
        else if (val1 !== val2) {
            differences[key] = {  newValue: val1, oldValue: val2 };
        }
    }

    for (const key in obj2) {
        if (!(key in obj1) && !excludedKeys.includes(key)) {
            differences[key] = { oldValue: undefined, newValue: obj2[key] };
        }
    }

    return differences;
}
