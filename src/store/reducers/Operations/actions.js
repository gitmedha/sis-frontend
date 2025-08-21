import {SEARCH_OPS,RESET_SEARCH,SORT_DATA,NO_RESULT_FOUND} from './types';

import api from "../../../apis";


function convertObject(input) {
  if (input && input.searchField) {
    return {
      searchFields: input.searchField.searchFields || [],
      searchValues: input.searchField.searchValues || []
    };
  }
  return {};
}

export const searchOperationTab = (baseUrl,searchField,value) => async(dispatch)=>{
    const authToken =localStorage.getItem('token')
    
    const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', }
    try {
        console.log(searchField, value);
        const searchfeildvalues= convertObject({
            "searchField":searchField,
            "searchValue":value
        });
        const {data} = await api.post(`/${baseUrl}/search`, searchfeildvalues,{headers})

        if(data.length){
            dispatch({
                type:SEARCH_OPS,
                payload:data
            });

        }
        else {
            dispatch({
                type:NO_RESULT_FOUND,
                payload: data
            })
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