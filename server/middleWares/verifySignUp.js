import db from '../models/index.js';
const ROLES = db.ROLES;
const User = db.user;

export const checkDuplicateUsernameOrEmail = async (req) => {
  try {
    const isUserName = await User.findOne({ username: req.body.username });
    
    if (isUserName !== null) {
      return ({ status: 400, message: 'Failed! User Name is already in use!' });
    }

    const isEmail = await User.findOne({ email: req.body.email });

    if (isEmail !== null) {
      return ({ status: 400, message: 'Failed! Email is already in use!' });
    }

    return ({ status: 200, message: 'Passed! Username Email check!' })
  } catch (err) {
    return ({ status: 500, message: err })
  }

};

export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return { status: 400, message: `Failed! Role ${req.body.roles[i]} does not exist!` };
      }
    }
  }
  return ({ status: 200, message: 'Passed! Roles check!' })
};

export default false;