import jwt from 'jsonwebtoken';
import config from '../config/auth.config.js';
import db from '../models/index.js';
const User = db.user;
const Role = db.role;

export const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return ({ status: 403, message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return ({status: 401, message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
     return ({status:500, message: err });
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          return ({status:500, message: err });
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        return ({status:403, message: 'Require Admin role' });
      }
    );
  });
};

export const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          return {status:500, message: err };
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        return {status:403, message: 'Require Moderator role' };
      }
    );
  });
};

export default false;