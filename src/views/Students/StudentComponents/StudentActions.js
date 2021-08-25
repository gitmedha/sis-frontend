import api from "../../../apis";
import { GET_PICKLIST, GET_STUDENT } from "../../../graphql";

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
