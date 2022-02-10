const db = require("../models/authModel");
const ROLES = db.ROLES;
const Customer = db.customer;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  Customer.findOne({
    brideName: req.body.brideName
  }).exec((err, user) => {
    console.log(user);
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    
    // Email
    Customer.findOne({
      email: req.body.email
    }).exec((err, user) => {
      console.log(user);
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).json({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).json({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;