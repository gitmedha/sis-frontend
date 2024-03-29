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


export const createEvent = async (reportingData)=>{
  try {
    await api.post('/alumni-events/create-events', reportingData);

  } catch (error) {
    console.error(error);
  }

};


export const getEvents = async function(){
  try {
    const {data} = await api.post('/alumni-events/get-events',{});
    console.log("data",data);
    return data;
  } catch (error) {
    console.error(error);
  }
}