const User = require("../models").User
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const JWTConfig = require("../config/jwt-config");
const { sequelize } = require("../models");


exports.createUser = (req, res) => {
        let Name = req.body.name;
        let Email = req.body.email;
        let Password = bcrypt.hashSync(req.body.password, 10);
        let MobileNo = req.body.mobileno;

        // if user already registered then.....
        User.findOne({
            where: {
                email: Email
            }
        }).then((user) => {
            if (user) {
                res.status(400).json({
                    status: 0,
                    message: "user already Registered with this email."
                });
            } else {
                User.create({
                    name: Name,
                    email: Email,
                    password: Password,
                    mobileno: MobileNo

                }).then((response) => {
                    res.status(200).json({
                        status: 1,
                        message: "User has been Registered Successfully !"
                    });

                }).catch((error) => {
                    res.status(500).json({
                        status: 0,
                        message: error.errors ? error.errors[0].message : "An unknown error occurred"
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
                let email = user.email;
                let name = user.name;
                console.log("email", email);
                console.log("name", name);


                res.status(200).json({
                    status: 1,
                    message: "user logged in successfully !",
                    UserName: name,
                    UserEmail: email,
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
            res.status(501).json({
                status: 0,
                message: "user not exist with this email address"


            });
        }
    }).catch((error) => {
        console.log(error);

    })




};

exports.profile = (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    }).then((user) => {
        console.log("user", user);

        if (user) {
            res.status(200).json({
                message: "Users data Found",
                UserData: user
            });
        } else {
            // we dont have user
            res.status(501).json({
                status: 0,
                message: "user not exist or Token is not Valid"


            });
        }
    }).catch((error) => {
        console.log(error);

    })




};


exports.editprofile = (req, res) => {
    let MobileNo = req.body.mobileno
    let Name = req.body.name;
    let Email = req.body.email
    User.findOne({
        where: {
            id: req.user.id
        }
    }).then((user) => {
        if (user) {
            User.update({
                name: Name,
                email: Email,
                mobileno: MobileNo
            }, {
                where: {
                    id: req.user.id
                }
            }).then((rowsUpdated) => {
                if (rowsUpdated[0] > 0) {
                    User.findOne({
                        where: {
                            id: req.user.id
                        }
                    }).then((updatedUser) => {
                        res.status(200).json({
                            status: 1,
                            message: "User Updated Successfully",
                            UserData: updatedUser // print updated user data here
                        });
                    });
                } else {
                    res.status(400).json({
                        status: 0,
                        message: "Failed to Update User",
                    })

                }
            })
        } else {
            // we dont have user
            res.status(501).json({
                status: 0,
                message: "user not exist or Token is not Valid"
            });
        }
    }).catch((error) => {
        console.log(error);

    })




};


exports.contact = (req, res) => {

}