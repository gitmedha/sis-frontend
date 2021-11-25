import api from "../../../apis";
import {
  GET_PICKLIST,
  GET_ASSIGNEES_LIST,
  UPDATE_EMPLOYER,
  DELETE_EMPLOYER,
  CREATE_EMPLOYER,
  GET_EMPLOYER_EMPLOYMENT_CONNECTIONS
} from "../../../graphql";

export const getEmployersPickList = async () => {
  return await api
    .post("/graphql", {
      query: GET_PICKLIST,
      variables: {
        table: "employers",
      },
    })
    .then((data) => {
      let pickList = {};
      data?.data?.data?.picklistFieldConfigs.forEach((item) => {
        pickList[item.field] = item.values;
      });
      return pickList;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getAssigneeOptions = async () => {
  return await api
    .post("/graphql", {
      query: GET_ASSIGNEES_LIST,
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const createEmployer = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_EMPLOYER,
    variables: {data},
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const updateEmployer = async (id, data) => {
  return await api
    .post("/graphql", {
      query: UPDATE_EMPLOYER,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const deleteEmployer = async (id) => {
  return await api
    .post("/graphql", {
      query: DELETE_EMPLOYER,
      variables: {
        id,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getEmployerEmploymentConnections = async (employerId, limit=100, offset=0, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_EMPLOYER_EMPLOYMENT_CONNECTIONS,
    variables: {
      id: Number(employerId),
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
