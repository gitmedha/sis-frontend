import { values } from "lodash";
import api from "../../../src/apis";
import { GET_ALL_ADDRESS, GET_ALL_DISTRICTS, GET_ALL_AREA } from "../../graphql/address";

export const getAddressOptions = async () => {
    return await api.post('/graphql', {
      query: GET_ALL_ADDRESS,
    }).then(data => {
      return data;
    }).catch(error => {
      return Promise.reject(error);
    });
  }
  ;

  export const getdistrict = async (value) => {
    return await api.post('/graphql', {
      query: GET_ALL_DISTRICTS,
      variables: {
      state:value.value
      },
    }).then(data => {
      return data;
    }).catch(error => {
      return Promise.reject(error);
    });
  }
  ;

  export const getarea = async (value) => {
    return await api.post('/graphql', {
      query: GET_ALL_AREA,
      variables: {
      district:value.value
      },
    }).then(data => {
      return data;
    }).catch(error => {
      return Promise.reject(error);
    });
  }
  ;
  