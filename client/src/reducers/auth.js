import {REGISTER_SUCCESS,REGISTER_FAIL,USER_LOADED,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL,LOG_OUT} from '../actions/types'

const initialState={
    token:localStorage.getItem('token'),
    user:null,
    isAuthenticated:null,
    loading:true
}

 function authReducer(state=initialState,action){
      switch(action.type){
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token',action.payload.token)
            return {
                ...state,...action.payload,isAuthenticated:true,loading:false
            }
        case USER_LOADED:
            return{
                ...state,user:action.payload,isAuthenticated:true,loading:false
            }  
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case LOG_OUT:
        case AUTH_ERROR:
                localStorage.removeItem('token')
                return {
                    ...state,token:null,isAuthenticated:false,loading:false
                }   
        default:
                return state     
      }
}

export default authReducer