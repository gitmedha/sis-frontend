import api from "../../../apis";
import { GET_PICKLIST, GET_ASSIGNEES_LIST, GET_INSTITUTE, UPDATE_INSTITUTION, CREATE_NEW_INSTITUTE, DELETE_INSTITUTION } from "../../../graphql";

export const queryBuilder = async (params) => {
  try {
    let { data } = await api.post("/graphql", {
      ...params,
    });
    return data;
  } catch (err) {
    console.log("ERR", err);
    throw err;
  }
};

export const getInstitutionsPickList = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'institutions'
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

export const getAssigneeOptions = async () => {
  return await api.post('/graphql', {
    query: GET_ASSIGNEES_LIST,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const createInstitution = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_NEW_INSTITUTE,
    variables: {...data},
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const updateInstitution = async (id, data) => {
  return await api.post('/graphql', {
    query: UPDATE_INSTITUTION,
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


export const deleteInstitution = async (id) => {
  return await api.post('/graphql', {
    query: DELETE_INSTITUTION,
    variables: {
      id
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}
