import api from "../../../apis";
import { GET_PICKLIST, GET_ASSIGNEES_LIST } from "../../../graphql";

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
