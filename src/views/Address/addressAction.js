import api from "../../../src/apis";
import { GET_ALL_ADDRESS } from "../../graphql/address";

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