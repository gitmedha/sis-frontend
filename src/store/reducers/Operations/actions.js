import {SEARCH_OPS,RESET_SEARCH,SORT_DATA,NO_RESULT_FOUND} from './types';

import api from "../../../apis";


// Helper to support both usages of searchOperationTab:
// 1) searchOperationTab(baseUrl, { searchFields, searchValues })  // Ops / Upskill / TOT
// 2) searchOperationTab(baseUrl, "student_name", "name of the student") // Alumni (single field)
function buildSearchPayload(searchFieldOrPayload, value) {
    // Case 1: caller already passed the full payload object
    if (
      searchFieldOrPayload &&
      typeof searchFieldOrPayload === "object" &&
      Array.isArray(searchFieldOrPayload.searchFields)
    ) {
      return searchFieldOrPayload;
    }
  
    // Case 2: simple field + value (alumni)
    if (typeof searchFieldOrPayload === "string" && value !== undefined) {
      return {
        searchField: searchFieldOrPayload,
        searchValue: value,
      };
    }
  
    // Fallback – backend will handle missing data
    return {};
  }
  
  export const searchOperationTab = (baseUrl,searchField,value) => async(dispatch)=>{
      const authToken =localStorage.getItem('token')
      
      const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', }
      try {
          const payload = buildSearchPayload(searchField, value);
          const {data} = await api.post(`/${baseUrl}/search`, payload,{headers})
  
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