import axios from 'axios'
import setAlert from './alert'
import setAuthToken from '../utils/setAuthToken'
import {REGISTER_SUCCESS,REGISTER_FAIL,AUTH_ERROR,USER_LOADED,LOGIN_SUCCESS,LOGIN_FAIL,LOG_OUT,CLEAR_PROFILE} from './types.js'

//GET user
export const loadUser=()=>async dispatch=>{
         if(localStorage.token){
            setAuthToken(localStorage.token)  //to make token header as default while sending request
         }
         try{
             console.log('yes')
                 const res=await axios.get('api/auth')
                 console.log('lmao')
                 dispatch({
                     type:USER_LOADED,
                     payload:res.data
                 })
         }catch(error){
            dispatch({
                type:AUTH_ERROR
            })
         }
}

//REGISTER user
export const registerUser=(name,email,password)=> async dispatch=>{                    
 
    const body=JSON.stringify({name,email,password})
    
    const config={
         headers:{
            'Content-Type':'application/json'
             }
        }

        try{
            const res=await axios.post('api/users',body,config)

            dispatch({
                type:REGISTER_SUCCESS,
                payload:res.data
            })
            dispatch(loadUser());
       }  catch(error){
           console.log(error)
         const errors=error.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
        } 
        dispatch({
            type:REGISTER_FAIL
        })
       }       

    }   

    // Login User
export const login = (email, password) => async dispatch => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const body = JSON.stringify({ email, password });
  
    try {
      const res = await axios.post('/api/auth', body, config);
  
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
  
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: LOGIN_FAIL
      });
    }
  };

  // Logout / Clear Profile
export const logout = () => dispatch => {
    dispatch({ type: LOG_OUT })
    dispatch({ type: CLEAR_PROFILE })
    if(localStorage.token){
      setAuthToken(null)  //to make token header as default while sending request
   }
  };
