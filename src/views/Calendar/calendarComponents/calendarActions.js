import api from "../../../apis";
import {GET_PICKLIST} from '../../../graphql/calendar';

export const getAlumniServicePickList = async () => {
    return await api.post("/graphql", {
      query : GET_PICKLIST, 
      variables: {
        table: 'alumni_services'
      }
    }).then(data => {
      let pickList = {};
      data?.data?.data?.picklistFieldConfigs.forEach((item) => {
        pickList[item.field] = item.values;
      });
      return pickList;
    }).catch(error => {
      return Promise.reject(error);
    });
    }