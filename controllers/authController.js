const config = require("../config/authConfig");
const { encrypt } = require('../config/crypto');
const db = require("../models/authModel");
const User = db.customer;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.authController = {
  async validateToken(req,res) {
     const token = req.cookies["user_token"];
    const userData = await User.findById(req.userId);
    if(userData){
      res.status(200).json({message:`${req.userId}`});
    } else{
      res.status(404).json({message:`Invalid User!`});
    }
  },
  signUp(req, res) {
    const user = new User({
      brideName: req.body.formInput.brideName,
      groomName: req.body.formInput.groomName,
      email: req.body.formInput.email,
      budget:req.body.formInput.budget,
      roles:req.body.formInput.roles,
      password: bcrypt.hashSync(req.body.formInput.password, 8)
    });
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (req.body.formInput.roles) {
        Role.find(
          {
            name: { $in: req.body.formInput.roles }
          },
          (err, roles) => {
            if (err) {
              res.status(500).json({ message: err });
              return;
            }
            user.roles = roles.map(role => role._id);
            user.save(err => {
              if (err) {
                res.status(500).json({ message: err });
                return;
              }
              res.json({ message: "User was registered successfully!" });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).json({ message: err });
            return;
          }
          user.roles = [role._id];
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.status(200).json({ message: "User was registered successfully!" });
          });
        });
      }
    });
  },
  signIn(req, res) {
    User.findOne({
      email: req.body.Email
    })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
    
        const passwordIsValid = bcrypt.compareSync(
          req.body.Password,
          user.password
        );   
        if(!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        const token = jwt.sign({ id: user._doc._id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
        let authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
          user.roles[i].name='user';
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        // cookie part
        let options = {
          path:"/",
          sameSite: true,
          expires: new Date(Date.now() + 9000000),
          httpOnly: false, // The cookie only accessible by the web server
        }
        res.cookie('user_token',token, options);
        res.status(200).json({
          ...user._doc,
          password: undefined,
          roles: authorities,
          accessToken: token
        });
      });
  }
}


