import {SEARCH_OPS,RESET_SEARCH,SORT_DATA} from './types';

const INIT_STATE = {
    data:[],
    loading:false,
    isSorting:false,
}

const Operations = (state = INIT_STATE, {type,payload}) =>{
    
    switch(type){
        case SEARCH_OPS:
            return {
                ...state,
                data: [...payload],
                loading: true
            };
        case RESET_SEARCH:
            return {
                data: [],
                loading:false
            }
        case SORT_DATA:
            return {
                ...state,
                data:[...payload],
                isSorting:true
            }
        default:
            break;
    };
   
    return state;
}

export default Operations;