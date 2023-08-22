import {SEARCH_OPS} from './types';

const INIT_STATE = {
    data:[]
}

const Operations = (state = INIT_STATE, {type,payload}) =>{

    switch(type){
        case SEARCH_OPS:
            return [...state]
        default:
            break;
    };
   
    return state;
}

export default Operations;