import {SEARCH_OPS} from './types';

const INIT_STATE = {
    data:[],
    loading:true
}

const Operations = (state = INIT_STATE, {type,payload}) =>{
    
    switch(type){
        case SEARCH_OPS:
            return {
                ...state,
                data: [...payload.data],
                loading: false
            };
        default:
            break;
    };
   
    return state;
}

export default Operations;