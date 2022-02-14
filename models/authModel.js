const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;

db.customer = require("./customer");
db.supplier=require("./supplier");
db.role = require("./roleModel");


module.exports = db;