import api from "../../apis";
import { GET_PICKLIST, UPDATE_BATCH } from "../../graphql";

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
