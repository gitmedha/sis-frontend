
import api from "../../../../src/apis";

import {GET_OPERATIONS,CREATE_OPERATION,UPDATE_OPERATION} from "../../../graphql/operations";


export const getAllOperations = async (limit=100,offset=0,sortBy="created_at", sortOrder = "desc")=>{
    const authToken =localStorage.getItem('token')
    console.log('authToken',authToken);
    const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', };
    
    return await api.post('/graphql', {
        query:GET_OPERATIONS,
        variables: {
            limit: limit,
            start:offset,
            sort: `${sortBy}:${sortOrder}`
        }
        
    },{headers}).then(data=>{
        console.log("data----------------->\n",data)
        return data;
    }).catch(error=>{
        console.log("error",error)
        return Promise.reject(error)
    })
};


export const createOperation = async (data)=>{
    return await api.post('/graphql', {
        query:CREATE_OPERATION,
        variables: {data},
    }).then(data=>{
        return data;
    }).catch(error=>{
        return Promise.reject(error);
    })

}


export const updateOperation = async(id,data)=>{
    return await api.post('/graphql', {
        query:UPDATE_OPERATION,
        variables: {
            id,
            data
        },
    }).then(data=>{
        return data;
    }).catch(error=>{
        return Promise.reject(error);
    })
}
