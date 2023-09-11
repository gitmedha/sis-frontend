import {SEARCH_OPS,RESET_SEARCH,SORT_DATA} from './types';

import api from "../../../apis";

export const searchOperationTab = (baseUrl,searchField,value) => async(dispatch)=>{
    const authToken =localStorage.getItem('token')
    
    const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', }
    try {
        const {data} = await api.post(`/${baseUrl}/search`, {
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

export const sortAscending = (sortedData)=> async(dispatch)=>{
    try {
        dispatch({
            type:SORT_DATA,
            payload:sortedData
        })
        
    } catch (error) {
        console.error(error);
    }
}