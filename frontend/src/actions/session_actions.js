import * as APIUtil from '../util/session_api_util';
import jwt_decode from 'jwt-decode';
import { decode } from 'punycode';

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";
export const RECEIVE_USER_LOGOUT = "RECEIVE_USER_LOGOUT";
export const RECEIVE_USER_SIGNIN = "RECEIVE_USER_SIGNIN";

//dispatch when user signs in
export const receiveCurrentUser = currentUser => ({
    type: RECEIVE_CURRENT_USER,
    currentUser
});

//redirect user to home page on signup

export const receiveUserSignin = () => ({
    type: RECEIVE_USER_SIGNIN
});

//show authentication errors frontend

export const receiveSessionErrors = errors => ({
    type: RECEIVE_SESSION_ERRORS,
    errors
});

//sets isAuthenticated to false

export const logoutUser = () => ({
    type: RECEIVE_USER_LOGOUT
});

//dispatch appropriate action on signup

export const signup = user => dispatch => {
    APIUtil.signup(user).then(() => receiveUserSignin(),
    err => dispatch(receiveSessionErrors(err.response.data)));
};

//upon login, set session token and dispatch current user

export const login = user => dispatch => (
    APIUtil.login(user).then(res => {
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        APIUtil.setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(receiveCurrentUser(decoded));
    })
    .catch(err => {
        dispatch(receiveSessionErrors(err.response.data));
    })
);

//logout user and destroy session token
export const logout = () => dispatch => {
    // remove token from localstorage
    localStorage.removeItem('jwtToken');
    
    // remove token from common axios header
    APIUtil.setAuthToken(false);

    dispatch(logoutUser());
};
