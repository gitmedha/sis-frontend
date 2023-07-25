
import api from "../../../../src/apis";

import {
    GET_OPERATIONS,
    CREATE_OPERATION,
    UPDATE_OPERATION,
    GET_USERSTOTS,
    CREATE_USER_TOT,
    UPDATE_USER_TOT

} from "../../../graphql/operations";


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
        return data;
    }).catch(error=>{
        console.log("error",error)
        return Promise.reject(error)
    })
};


export const getAllUsersTots = async (limit=100, offset=0,sortBy="created_at", sortOrder = "desc")=>{
    const authToken = localStorage.getItem('token');
    const headers ={ Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', };

    return await api.post('/graphql', {
        query:GET_USERSTOTS,
        variables: {
            limit: limit,
            start:offset,
            sort: `${sortBy}:${sortOrder}`
        }
    }, {headers})
    .then (data=>{
        return data;
    }).catch(err=>{
        return Promise.reject(err)
    })

}

export const createOperation = async (data)=>{
    return await api.post('/graphql', {
        query:CREATE_OPERATION,
        variables: {data},
    }).then(data=>{
        console.log(data)
        return data;
    }).catch(error=>{
        console.log(error)
        return Promise.reject(error);
    })

}

export const createUsersTot = async(data)=>{
    return await api.post('/graphql', {
        query:CREATE_USER_TOT,
        variables: {data}
    }).then(data=> data)
    .catch(error=>Promise.reject(error))
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

export const updateUserTot = async(id,data)=>{
    return await api.post('/graphql', {
        query:UPDATE_USER_TOT,
        variables: {
            id,
            data
        }
    }).then(data=> data)
    .catch(error=>Promise.reject(error));
}
