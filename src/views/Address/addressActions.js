import { values } from "lodash";
import api from "../../../src/apis";
import { GET_ALL_ADDRESS, GET_ALL_DISTRICTS } from "../../graphql/address";

export const getAddressOptions = async () => {
  return await api.post('/graphql', {
    query: GET_ALL_ADDRESS,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const getStateDistricts = async (value) => {
  return await api.post('/graphql', {
    query: GET_ALL_DISTRICTS,
    variables: {
      state:value?.value
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};
export const getCities = async (value) => {
  const limit = 500;  // Number of records per request
  let allData = [];
  let start = 0;
  let totalCount = 0;

  try {
    const stateFilter = value?.value ? `state: "${value?.value}",` : ``;

    const GET_ALL_CITIES = `
      query GET_GEOGRAPHIES($start: Int, $limit: Int) {
        geographies(where: { ${stateFilter} city_null: false }, start: $start, limit: $limit) {
          city
          state
        }
        geographiesConnection {
          aggregate {
            count
          }
        }
      }
    `;

    const countResponse = await api.post('/graphql', {
      query: GET_ALL_CITIES,
      variables: {
        start: 0,
        limit: 1,  
      },
    });

    totalCount = countResponse?.data?.data?.geographiesConnection?.aggregate?.count;

    // Fetch data in batches until all records are retrieved
    while (start < totalCount) {
      const response = await api.post('/graphql', {
        query: GET_ALL_CITIES,
        variables: {
          start,
          limit,
        },
      });

      const data = response?.data?.data?.geographies;

      if (data && data.length) {
        allData = [...allData, ...data];  
      }

      start += limit;  
    }
    return allData; 
  } catch (error) {
    return Promise.reject(error);  
  }
};