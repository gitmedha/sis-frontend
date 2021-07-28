import api from "../../apis";
import { GET_PICKLIST } from "../../graphql";

export const getInstitutionsPickList = async (successCallback) => {
  await api.post("/graphql", {
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
    successCallback(pickList);
    return data;
  })
  .catch(error => {
    return Promise.reject(error);
  });
};
