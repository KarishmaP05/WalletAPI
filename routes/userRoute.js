const { createUser, loginUser, validateUser, contact } = require("../Controllers/UserController");


const express = require("express");
const router = express.Router();



// Create User 
router.post("/signup", createUser)
router.post("/login", loginUser)
router.post("/contact", contact)




//
module.exports = router;