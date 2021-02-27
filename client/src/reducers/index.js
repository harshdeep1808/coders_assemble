import {combineReducers} from 'redux'
import alert from './alert'
import auth from './auth'
import profileReducer from './profile'
import post from './post'

export default combineReducers({
     alert,
     auth,
     profile:profileReducer,
     post
})
