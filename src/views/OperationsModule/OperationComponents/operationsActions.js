
import api from "../../../apis";

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
    UPDATE_SAMARTH_SDIT,
    GET_ALUMNI_QUERIES,
    CREATE_ALUMNI_QUERY,
    UPDATE_ALUMNI_QUERY,
    GET_COLLEGE_PITCHES,
    CREATE_COLLEGE_PITCH,
    UPDATE_COLLEGE_PITCH
    
} from "../../../graphql/operations";


export const getAllOpsActivities = async (limit=100,offset=0,sortBy="created_at", sortOrder = "desc")=>{
    const authToken =localStorage.getItem('token')
    
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

export const getAllAlumniQueries = async (limit=100, offset=0,sortBy="created_at", sortOrder="desc")=>{
    const authToken = localStorage.getItem('token');
    const headers ={ Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', };

    return await api.post('/graphql', {
        query:GET_ALUMNI_QUERIES,
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

export const getAllCollegePitches = async (limit=100, offset=0,sortBy="created_at", sortOrder="desc")=>{
    const authToken = localStorage.getItem('token');
    const headers ={ Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', };

    return await api.post('/graphql', {
        query:GET_COLLEGE_PITCHES,
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
export const createOpsActivity = async (data)=>{
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


export const createAlumniQuery = async(data)=>{
    return await api.post('/graphql', {
        query:CREATE_ALUMNI_QUERY,
        variables: {data}
    }).then(data=> data)
    .catch(error=>Promise.reject(error))

}

export const createCollegePitch = async (data)=>{
    return await api.post('/graphql', {
        query:CREATE_COLLEGE_PITCH,
        variables: {data}
    }).then(data=> data)
    .catch(error=>Promise.reject(error))   
}

export const updateOpsActivity = async(id,data)=>{
   
    return await api.post('/graphql', {
        query:UPDATE_OPERATION,
        variables: {
            id,
            data
        },
    }).then(data=>{
        return data;
    }).catch(error=>{
        console.log(error)
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

export const updateAlumniQuery = async(id,data)=>{
    return await api.post('/graphql', {
        query:UPDATE_ALUMNI_QUERY,
        variables: {
            id,
            data
        }
    }).then(data=> data)
    .catch(error=>Promise.reject(error));

}

export const updateCollegePitch = async(id,data)=>{
    return await api.post('/graphql', {
        query:UPDATE_COLLEGE_PITCH,
        variables: {
            id,
            data
        }
    }).then(data=> data)
    .catch(error=>Promise.reject(error));

}


export const bulkCreateOpsActivities = async (data) =>{
    try {
        const response = await api.post('/users-ops-activities/createBulkOperations', data);
        return response;
    } catch (error) {
        return console.error(error)
    }
};
export const bulkCreateUsersTots = async (data) =>{
    try {
        const response = await api.post('/users-tots/createBulkTots', data);
        return response;
    } catch (error) {
        return console.error(error)
    }

};
export const bulkCreateStudentsUpskillings = async (data) =>{
    try {
        const response = await api.post('/students-upskillings/createBulkUpSkills', data);
        return response;
    } catch (error) {
        return console.error(error)
    }

};
export const bulkCreateSamarth = async (data) =>{
    try {
        const response = await api.post('/dte-samarth-sdits/createBulkSamarths', data);
        return response;
    } catch (error) {
        return console.error(error)
    }
};

export const bulkCreateCollegePitch = async(data)=>{
    try {
        const response = await api.post('/college-pitches/create-bulk-college-pitch', data);
        return response;
    } catch (error) {
        return console.error(error)
    }

}

export const bulkCreateAlumniQueries = async(data)=>{
    try {
        const response = await api.post('/alumni-queries/create-bulk-alumni-queries', data);
        return response;
    } catch (error) {
        return console.error(error)
    }

}


export const deactivate_user_ops = async(id)=>{

    let data = {"isActive":false}

    return await api.post('/graphql', {
        query:UPDATE_OPERATION,
        variables: {
            id,
            data
        },
    }).then(data=>{
        return data;
    }).catch(error=>{
        console.log(error)
        return Promise.reject(error);
    })

    // try {

    //     // const response = await api.put(`/users-ops-activities/deactivate-ops/${id}`, {
    //     //     "fieldToUpdate":fieldToUpdate,
    //     //     "newValue":newValue
    //     // })
    //     // return response;
    // } catch (error) {
    //     return console.error(error)
    // }
}
export const deactivate_user_tots = async(id)=>{
    let data = {"isActive":false}

    return await api.post('/graphql', {
        query:UPDATE_USER_TOT,
        variables: {
            id,
            data
        },
    }).then(data=>{
        return data;
    }).catch(error=>{
        console.log(error)
        return Promise.reject(error);
    })
}
export const deactivate_user_dte_samarth = async(id)=>{
    let data = {"isActive":false}

    return await api.post('/graphql', {
        query:UPDATE_SAMARTH_SDIT,
        variables: {
            id,
            data
        },
    }).then(data=>{
        return data;
    }).catch(error=>{
        console.log(error)
        return Promise.reject(error);
    })
}
export const deactivate_user_students_upskills = async(id)=>{
    let data = {"isActive":false}

    return await api.post('/graphql', {
        query:UPDATE_STUDENTS_UPSKILLING,
        variables: {
            id,
            data
        },
    }).then(data=>{
        return data;
    }).catch(error=>{
        console.log(error)
        return Promise.reject(error);
    })
}
export const deactivate_user_alumni_query = async(id)=>{
    let data = {"isActive":false}

    return await api.post('/graphql', {
        query:UPDATE_ALUMNI_QUERY,
        variables: {
            id,
            data
        },
    }).then(data=>{
        return data;
    }).catch(error=>{
        console.log(error)
        return Promise.reject(error);
    })
}
export const deactivate_user_college_pitch = async(id)=>{
    let data = {"isActive":false}

    return await api.post('/graphql', {
        query:UPDATE_COLLEGE_PITCH,
        variables: {
            id,
            data
        },
    }).then(data=>{
        return data;
    }).catch(error=>{
        console.log(error)
        return Promise.reject(error);
    })
}
