const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;

db.customer = require("./customer");
db.role = require("./roleModel");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;