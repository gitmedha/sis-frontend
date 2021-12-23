import api from "../../apis";
import { GET_ALL_BATCHES, GET_BATCH_PROGRAM_ENROLLMENTS, GET_PICKLIST, DELETE_BATCH, UPDATE_BATCH, CREATE_NEW_BATCH, CREATE_SESSION, GET_SESSIONS, GET_SESSION_ATTENDANCE_STATS, GET_SESSION_ATTENDANCE, UPDATE_SESSION_QUERY, UPDATE_SESSION_ATTENDANCE, MARK_ATTENDANCE, GET_STUDENT_COUNT_BY_BATCH, GET_BATCH_STUDENTS_ATTENDANCE } from "../../graphql";

export const getBatchesPickList = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'batches'
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

export const createBatch = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_NEW_BATCH,
    variables: {data},
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const updateBatch = async (id, data) => {
  return await api.post("/graphql", {
    query: UPDATE_BATCH,
    variables: {
      id,
      data,
    },
  })
  .then(data => {
    return data;
  })
  .catch(error => {
    return Promise.reject(error);
  });
};

export const deleteBatch = async (id) => {
  return await api.post('/graphql', {
    query: DELETE_BATCH,
    variables: {
      batch: id,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const createBatchSession = async (batchId, data) => {
  return await api.post('/graphql', {
    query: CREATE_SESSION,
    variables: {
      batchID: batchId,
      ...data,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const updateSession = async (sessionId, data) => {
  return await api.post('/graphql', {
    query: UPDATE_SESSION_QUERY,
    variables: {
      id: sessionId,
      data,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getBatchSessions = async (batchId, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_SESSIONS,
    variables: {
      id: batchId,
      sort: `${sortBy}:${sortOrder}`,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getBatchSessionAttendanceStats = async (batchId) => {
  return await api.post('/graphql', {
    query: GET_SESSION_ATTENDANCE_STATS,
    variables: {
      id: batchId,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getSessionAttendance = async (sessionId) => {
  return await api.post('/graphql', {
    query: GET_SESSION_ATTENDANCE,
    variables: {
      sessionID: sessionId,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const createSessionAttendance = async (sessionId, data) => {
  return await api.post('/graphql', {
    query: MARK_ATTENDANCE,
    variables: {
      session: sessionId,
      ...data,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const updateAttendance = async (attendanceId, data) => {
  return await api.post('/graphql', {
    query: UPDATE_SESSION_ATTENDANCE,
    variables: {
      id: attendanceId,
      data,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getStudentCountByBatch = async () => {
  return await api.post('/graphql', {
    query: GET_STUDENT_COUNT_BY_BATCH,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getBatchStudentAttendances = async (batchId) => {
  return await api.post('/graphql', {
    query: GET_BATCH_STUDENTS_ATTENDANCE,
    variables: {
      id: batchId,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getBatchProgramEnrollments = async (batchID, limit=100, offset=0, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_BATCH_PROGRAM_ENROLLMENTS,
    variables: {
      id: Number(batchID),
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
;
