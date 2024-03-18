const User = require("../models").User
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const JWTConfig = require("../config/jwt-config");
const { sequelize } = require("../models");


exports.createUser = (req, res) => {

        let Name = req.body.name;
        let Email = req.body.email;
        let Password = bcrypt.hashSync(req.body.password, 10);

        // if user already registered then.....
        User.findOne({
            where: {
                email: Email
            }
        }).then((user) => {
            if (user) {
                res.status(200).json({
                    status: 0,
                    message: "user already Registered"
                });
            } else {
                User.create({
                    name: Name,
                    email: Email,
                    password: Password

                }).then((response) => {
                    res.status(200).json({
                        status: 1,
                        message: "User has been Registered Successfully "
                    });

                }).catch((error) => {
                    res.status(500).json({
                        status: 0,
                        data: error
                    });
                });
            }
        }).catch((error) => {
            console.log(error);
        });


    }
    // Login User

exports.loginUser = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then((user) => {
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {

                let userToken = JWT.sign({
                    email: user.email,
                    id: user.id
                }, JWTConfig.secret, {
                    expiresIn: JWTConfig.expiresIn, // configuration
                    notBefore: JWTConfig.notBefore,
                    audience: JWTConfig.audience,
                    issuer: JWTConfig.issuer,
                    algorithm: JWTConfig.algorithm

                });
                User.update({ logincount: sequelize.literal('logincount + 1') }, { where: { id: user.id } }) // to increment logincount
                User.update({
                    lastlogin: Date.now()
                }, {
                    where: {
                        id: user.id
                    }
                })

                res.status(200).json({
                    status: 1,
                    message: "user logged in successfully",
                    token: userToken

                });



            } else {
                res.status(500).json({
                    status: 0,
                    message: "password didnt match"
                });
            }

        } else {
            // we dont have user
            res.status(500).json({
                status: 0,
                message: "user not exist with this email address"


            });
        }
    }).catch((error) => {
        console.log(error);

    })




};