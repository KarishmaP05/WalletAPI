const { createUser, loginUser, validateUser } = require("../Controllers/UserController");


const express = require("express");
const router = express.Router();



// Create User 
router.post("/signup", createUser)
router.post("/login", loginUser)



//
module.exports = router;