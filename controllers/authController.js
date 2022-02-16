const config = require("../config/authConfig");
const db = require("../models/authModel");
const User = require('../models/customer')
const supplierModel = db;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/customer");
const Supplier = require("../models/supplier");

exports.authController = {
  async validateToken(req, res) {
    const token = req.cookies["user_token"];
    const userData = await User.findById(req.userId);
    if (userData) {
      res.status(200).json(userData);
    } else {
      const supplierData = await Supplier.findById(req.userId);
      if (supplierData) {
        res.status(200).json(supplierData);
      } else {
        res.status(404).json({ message: `Invalid User!` });
      }
    }
  },
  async signUp(req, res) {
    try {
      let user;
      if (req.body.roles === 'supplier') {
        const location = [];
        const locationObj = {
          country: 'Israel',
          cityId: 'ChIJSzegs7ZHHRURj609UxDsDwo',
          city: req.body.location.substring(req.body.location.indexOf(',') + 1),
          address: req.body.location.substring(0, req.body.location.indexOf(','))
        };
        location.push(locationObj);
        user = new Supplier({
          ...req.body,
          location: location,
          password: bcrypt.hashSync(req.body.password, 8),
        })
      } else {
        user = new User({
          ...req.body,
          password: bcrypt.hashSync(req.body.password, 8),
        });
      }
      const newUser = await user.save();
      res.status(200).send(newUser)
    } catch (e) {
      res.status(500).send({ message: e });
    }
  },
  async signIn(req, res) {
    try {
      const foundUser = await User.findOne({ email: req.body.Email });
      if (foundUser) {
        const passwordIsValid = bcrypt.compareSync(
          req.body.Password,
          foundUser.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        const token = jwt.sign({ id: foundUser._doc._id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });

        // cookie part
        let options = {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true, // The cookie only accessible by the web server
        }
        res.cookie('user_token', token, options);
        res.status(200).json({
          ...foundUser._doc,
          password: undefined,
          accessToken: token
        });
      } else if (!foundUser) {
        const foundSupplier = await Supplier.findOne({ email: req.body.Email });
        if (foundSupplier) {
          const passwordIsValid_ = bcrypt.compareSync(
            req.body.Password,
            foundSupplier.password
          );
          if (!passwordIsValid_) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
          const token = jwt.sign({ id: foundSupplier._id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });

          // cookie part
          let options = {
            expires: new Date(Date.now() + 9000000),
            httpOnly: true, // The cookie only accessible by the web server
          }
          res.cookie('user_token', token, options);
          res.status(200).json({
            ...foundSupplier._doc,
            password: undefined,
            accessToken: token
          });
        } else {
          res.status(404).send({ message: "User Not found." });

        }
      }
    } catch (e) {
      res.status(500).send(e);
    }
  },
  async Logout(req,res) {
    res.clearCookie("user_token").send('cleared cookie');
  }
}


