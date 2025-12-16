import {
  DELETE_ECOSYSTEM,
  UPDATE_ECOSYSTEM,
  DEACTIVATE_ECOSYSTEM_ENTRY,
  // Curriculum Intervention operations
  GET_CURRICULUM_INTERVENTIONS,
  UPDATE_CURRICULUM_INTERVENTION,
  DELETE_CURRICULUM_INTERVENTION,
  DEACTIVATE_CURRICULUM_INTERVENTION_ENTRY,
  UPDATE_PMUS_ENTRY,
  DEACTIVATE_PMUS_ENTRY
} from '../../../graphql/operations';
import api from '../../../apis'

export const getFieldValues = async (searchField, baseURL) => {
  try {
    const data = await api.get(`/${baseURL}/distinct/${searchField}`);

    return data;
  } catch (error) {
    return console.error("error", error);
  }
};
export const deactivateEcosystemEntry = async (id) => {
  try {
    const response = await api.post('/graphql', {
      query: DEACTIVATE_ECOSYSTEM_ENTRY,
      variables: {
        id,
        data: {
          isactive: false
        }
      }
    });
    return response.data.data.updateEcosystem;
  } catch (error) {
    return Promise.reject(error);
  }
};


export const updateEcosystemEntry = async (id, data) => {
  try {
    // Prepare the data for the mutation
    const payload = {
      ...data,
      // Ensure medha_poc values are IDs
      medha_poc_1: data.medha_poc_1?.id || data.medha_poc_1,
      medha_poc_2: data.medha_poc_2?.id || data.medha_poc_2,
    };

    const response = await api.post('/graphql', {
      query: UPDATE_ECOSYSTEM,
      variables: {
        id: Number(id),
        data: payload
      }
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return {
      status: 200,
      data: response.data.data.updateEcosystem.ecosystem
    };

  } catch (err) {
    return {
      status: err.response?.status || 500,
      error: err.message || "Failed to update ecosystem entry"
    };
  }
};

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

// Curriculum Intervention actions
export const deactivateCurriculumInterventionEntry = async (id) => {
  try {
    const response = await api.post('/graphql', {
      query: DEACTIVATE_CURRICULUM_INTERVENTION_ENTRY,
      variables: {
        id,
        data: {
          isactive: false
        }
      }
    });
    return response.data.data.updateCurriculumIntervention;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateCurriculumInterventionEntry = async (id, data) => {
  try{
    const response = await api.post('/graphql', {
      query:UPDATE_CURRICULUM_INTERVENTION,
       variables: {
        id,
        data,
      }
    })
    return response.data.data.updateCurriculumIntervention;
  }catch(err){
    return Promise.reject(err)
  }
}

export const deleteCurriculumInterventionEntry = async (id) => {
  try {
    const response = await api.post('/graphql', {
      query:DELETE_CURRICULUM_INTERVENTION,
      variables: {
        id,
      },
    });
    return response.data.data.deleteCurriculumIntervention.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deactivatePmusEntry = async (id) => {
  try {
    const response = await api.post('/graphql', {
      query: DEACTIVATE_PMUS_ENTRY,
      variables: {
        id,
        data: {
          isactive: false
        }
      }
    });
    return response.data.data.updatePmus;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updatePmusEntry = async (id, data) => {
  try {
    const response = await api.post('/graphql', {
      query: UPDATE_PMUS_ENTRY,
      variables: {
        id,
        data,
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
