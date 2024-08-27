const { createUser, loginUser, profile, editprofile } = require("../Controllers/UserController");
const { checkToken } = require("../config/jwt-middleware");



const express = require("express");
const router = express.Router();



// Create User 
router.post("/signup", createUser)
router.post("/login", loginUser)
router.get("/profile", checkToken, profile)
router.post("/editprofile", checkToken, editprofile)





//
module.exports = router;