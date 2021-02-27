import axios from 'axios'

const setAuthToken=async (token)=>{
    if(token){
       axios.defaults.headers.common['x-auth-token']=token
    }
    else{
        await delete axios.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken