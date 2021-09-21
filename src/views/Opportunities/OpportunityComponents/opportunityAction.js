import api from "../../../apis";
import {
  GET_PICKLIST,
  GET_ASSIGNEES_LIST,
  UPDATE_OPPORTUNITY,
  DELETE_OPPORTUNITY,
  CREATE_OPPORTUNITY
} from "../../../graphql";

export const getOpportunitiesPickList = async () => {
  return await api
    .post("/graphql", {
      query: GET_PICKLIST,
      variables: {
        table: "opportunities",
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

export const createOpportunity = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_OPPORTUNITY,
    variables: {data},
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const updateOpportunity = async (id, data) => {
  return await api
    .post("/graphql", {
      query: UPDATE_OPPORTUNITY,
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

export const deleteOpportunity = async (id) => {
  return await api
    .post("/graphql", {
      query: DELETE_OPPORTUNITY,
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
