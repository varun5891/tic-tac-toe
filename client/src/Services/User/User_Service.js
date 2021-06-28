import axios from 'axios';

export const getUsers = async () => {
    return await axios.get('/api/user/all');
}