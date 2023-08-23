import {SEARCH_OPS} from './types';

import api from "../../../apis";

export const searchOperationTab = (searchField,value) => async(dispatch)=>{
    const authToken =localStorage.getItem('token')
    
    const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', }

    console.log("wor")
   
    try {
        const data = await api.post('/users-ops-activities/search', {
            "searchField":searchField,
            "searchValue":value
        },{headers})

        dispatch({
            type:SEARCH_OPS,
            payload:data
        });
        
    } catch (error) {
        console.error("error",error);
    }
}