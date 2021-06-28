import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

import User from './user.model.js';
import Role from "./role.model.js";
db.role = Role;
db.user = User;
db.ROLES = ["user", "admin", "moderator"];

export default db;