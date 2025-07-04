import {
  DELETE_ECOSYSTEM,
  UPDATE_ECOSYSTEM
} from '../../../graphql/operations';
import api from '../../../apis'
export const getFieldValues = async (id) => {
  const response = await fetch(`/api/sa/ecosystem/${id}/fields`, {});
  if (!response.ok) {       
    throw new Error(`Error fetching field values: ${response.statusText}`);
  } 
    const data = await response.json();
    return data;
}
export const deactivate_ecosystem_entry = async (id) => {
  
}

export const updateEcosystemEntry = async (id, data) => {
  try{
    const response = await api.post('/graphql', {
      query:UPDATE_ECOSYSTEM,
       variables: {
        id,
        data,
      }
    })
return response.data.data.ecosystemConnections.values;
  }catch(err){
  return Promise.reject(err)
  }
}

export const deleteEcosystemEntry = async (id) => {
  try {
    const response = await api.post('/graphql', {
      query:DELETE_ECOSYSTEM,
      variables: {
        id,
      },
    });

    return response.data.data.deleteEcosystem.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
