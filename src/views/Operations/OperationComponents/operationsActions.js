
import api from "../../../../src/apis";

import {
    GET_OPERATIONS,
    CREATE_OPERATION,
    UPDATE_OPERATION,
    GET_USERSTOTS,
    CREATE_USER_TOT,
    UPDATE_USER_TOT,
    GET_STUDENTS_UPSKILLINGS,
    CREATE_STUDENT_UPSKILL,
    UPDATE_STUDENTS_UPSKILLING,
    GET_DTE_SAMARTH_SDITS,
    CREATE_SAMARTH_SDIT,
    UPDATE_SAMARTH_SDIT
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


export const getAllUpSkills = async (limit=100, offset=0, sortBy="created_at", sortOrder="desc")=>{
    const authToken = localStorage.getItem('token');
    const headers ={ Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', };

    return await api.post('/graphql', {
        query:GET_STUDENTS_UPSKILLINGS,
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

export const getAllSamarthSdits = async (limit=100, offset=0,sortBy="created_at", sortOrder="desc")=>{
    const authToken = localStorage.getItem('token');
    const headers ={ Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', };

    return await api.post('/graphql', {
        query:GET_DTE_SAMARTH_SDITS,
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


export const createStudentsUpskill = async(data)=>{
    return await api.post('/graphql', {
        query:CREATE_STUDENT_UPSKILL,
        variables: {data}
    }).then(data=> data)
    .catch(error=>Promise.reject(error))
}

export const createSamarthSdit = async(data)=>{
    return await api.post('/graphql', {
        query:CREATE_SAMARTH_SDIT,
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

export const updateStudetnsUpskills = async (id,data)=>{
    return await api.post('/graphql', {
        query:UPDATE_STUDENTS_UPSKILLING,
        variables: {
            id,
            data
        }
    }).then(data=> data)
    .catch(error=>Promise.reject(error));
}

export const updateSamarthSdit =  async (id, data) =>{
    return await api.post('/graphql', {
        query:UPDATE_SAMARTH_SDIT,
        variables: {
            id,
            data
        }
    }).then(data=> data)
    .catch(error=>Promise.reject(error));

}


