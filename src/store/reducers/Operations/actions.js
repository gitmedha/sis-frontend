import {SEARCH_OPS,RESET_SEARCH} from './types';

import api from "../../../apis";

export const searchOperationTab = (searchField,value) => async(dispatch)=>{
    const authToken =localStorage.getItem('token')
    
    const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', }
   
    try {
        const {data} = await api.post('/users-ops-activities/search', {
            "searchField":searchField,
            "searchValue":value
        },{headers})

        if(data.length){
            dispatch({
                type:SEARCH_OPS,
                payload:data
            });

        }

    } catch (error) {
        console.error("error",error);
    }
}

export const resetSearch = ()=> async(dispatch)=>{
    try {
        dispatch({
            type:RESET_SEARCH,
        })
        
    } catch (error) {
        console.error(error);
    }
}