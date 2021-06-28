import db from '../models/index.js';

const User = db.user;

export const allUsers = async () => {
    const users = [];
    try {
        for await (const doc of User.find()) {
            users.push(doc)
        }
        return ({ status: 200, message: 'Successfull', users: users })
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: error })
    }
};
