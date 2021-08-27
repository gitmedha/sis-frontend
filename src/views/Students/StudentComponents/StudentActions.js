import api from "../../../apis";
import { CREATE_PROGRAM_ENROLLMENT, GET_ALL_BATCHES, GET_ALL_INSTITUTES, GET_PICKLIST, GET_STUDENT, GET_STUDENT_PROGRAM_ENROLLMENTS, UPDATE_PROGRAM_ENROLLMENT } from "../../../graphql";

export const getStudentsPickList = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'students'
    },
  })
  .then(data => {
    let pickList = {};
    data?.data?.data?.picklistFieldConfigs.forEach((item) => {
      pickList[item.field] = item.values;
    });
    return pickList;
  })
  .catch(error => {
    return Promise.reject(error);
  });
};

export const getStudent = async (id) => {
  return await api.post("/graphql", {
    query: GET_STUDENT,
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

export const getStudentProgramEnrollments = async (studentId, limit=10, offset=0, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_STUDENT_PROGRAM_ENROLLMENTS,
    variables: {
      id: Number(studentId),
      limit: limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getAllBatches = async () => {
  return await api.post('/graphql', {
    query: GET_ALL_BATCHES,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getAllInstitutions = async () => {
  return await api.post('/graphql', {
    query: GET_ALL_INSTITUTES,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const createProgramEnrollment = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_PROGRAM_ENROLLMENT,
    variables: {
      data
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const updateProgramEnrollment = async (id, data) => {
  return await api.post('/graphql', {
    query: UPDATE_PROGRAM_ENROLLMENT,
    variables: {
      id,
      data
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}
