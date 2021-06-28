import axios from 'axios';

export const singin = async signinData => {
    return await axios.post('/api/auth/signin', signinData);
}

export const signup = async signupData => {
    return await axios.post('/api/auth/signup', signupData);
}
