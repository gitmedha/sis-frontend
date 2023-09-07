import {SEARCH_OPS,RESET_SEARCH} from './types';

const INIT_STATE = {
    data:[],
    loading:false
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
        default:
            break;
    };
   
    return state;
}

export default Operations;