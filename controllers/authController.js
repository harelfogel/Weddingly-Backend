const config = require("../config/authConfig");
const { encrypt } = require('../config/crypto');
const db = require("../models/authModel");
const User = db.customer;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs=require('fs');

exports.authController = {
  signUp(req, res) {
    const user = new User({
      brideName: req.body.brideName,
      groomName: req.body.groomName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles }
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
            res.json({ message: "User was registered successfully!" });
          });
        });
      }
    });
  },
  signIn(req, res) {
    console.log('sign in:::')
    User.findOne({
      brideName: req.body.formInput.brideName
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
          req.body.formInput.password,
          user.password
        );
          
        if((req.body.formInput.password!=user.password)) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });

        req.headers["x-access-token"]=token;
        const hash=encrypt(req.headers["x-access-token"]); 
        fs.writeFile('cookie.json', JSON.stringify(hash),'utf8',function(err) {
          if(err) {
            console.log('An error occured while writing to a file');
          }
        })
        // cookie part
        let options = {
          path:"/",
          sameSite:true,
          maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
          httpOnly: true, // The cookie only accessible by the web server
      }
        res.cookie('x_access_token',token, options);
        let authorities = [];
        // for (let i = 0; i < user.roles.length; i++) {
        //   authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        // }
        res.status(200).json({
          id: user._id,
          brideName: user.brideName,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
  }
}


