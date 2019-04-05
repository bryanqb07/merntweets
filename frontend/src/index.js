import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import Root from './components/root';

import configureStore from '../store/store';

// used to parse user's session token
import jwt_decode from 'jwt-decode';

import { setAuthToken } from '../util/session_api_util';

import { logout } from './actions/session_actions';

//import App from './App';
// import * as serviceWorker from './serviceWorker';

document.addEventListener("DOMContentLoaded", () =>{
    let store;
    
    // if returning user has session token in storage
    if(localStorage.jwtToken){
        // set token as common header for all axios requests
        setAuthToken(localStorage.jwtToken);

        // decode the token to get the user's info

        const decodedUser = jwt_decode(localStorage.jwtToken);
        
        // create a preloaded state we can add to our store

        const preloadedState = { session: { isAuthenticated: true, user: decodedUser }};

        store = configureStore(preloadedState);

        const currentTime = Date.now() / 1000;

        //if user's token has expired

        if(decodedUser.exp < currentTime){
            //logout user and redirect to login page 
            store.dispatch(logout());
            window.location.href = "/login";
        }
    }else{
        //if first time user, start with empty store
        store = configureStore();
    }

    ReactDOM.render(<Root store={store} />, document.getElementById('root'));

});
