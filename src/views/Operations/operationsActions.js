
import api from "../../../src/apis";

import {GET_OPERATIONS} from "../../graphql/operations";

export const getAllOperations = async (limit=100,offset=0,sortBy="created_at", sortOrder = "desc")=>{
    return await api.post('/graphql', {
        query:GET_OPERATIONS,
        variables: {
            limit: limit,
            start:offset,
            sort: `${sortBy}:${sortOrder}`
        }
    }).then(data=>{
        console.log("data",data)
        return data;
    }).catch(error=>{
        return Promise.reject(error)
    })
};


