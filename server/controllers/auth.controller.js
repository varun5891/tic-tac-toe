import config from '../config/auth.config.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const User = db.user;
const Role = db.role;


export const signup = async (req) => {

  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      lastlogindate: req.body.lastlogindate,
      registrationdate: req.body.registrationdate,
      status: req.body.status
    });

    const isUserSaved = user.save();

    if (isUserSaved !== null) {
      return ({ status: 200, message: "User registered successfully!" })
    }

  } catch (err) {
    return ({ status: 500, message: err })
  }

};

export const signin = async (req) => {
  try {
    const isUser = await User.findOne({ username: req.body.username });

    if (!isUser) {
      return ({ status: 404, message: "User Not found." });
    } else {
      await User.findOneAndUpdate(
        { username: req.body.username },
        { lastlogindate: new Date() },
        {
          returnOriginal: false
        }
      )
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      isUser.password
    );

    if (!passwordIsValid) {
      return ({ status: 401, message: "Invalid Password !." });
    }

    var token = jwt.sign({ id: isUser.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    var authorities = [];

    for (let i = 0; i < isUser.roles.length; i++) {
      authorities.push("ROLE_" + isUser.roles[i].name.toUpperCase());
    }


    const userResponse = {
      id: isUser._id,
      username: isUser.username,
      email: isUser.email,
      roles: authorities,
      accessToken: token,
    };

    return ({ status: 200, message: 'Successfully signed in', user: userResponse })

  } catch (err) {
    console.log(err);
    return ({ status: 500, message: err })
  }

};

