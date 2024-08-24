const express = require("express");
const { addBalance, withdrawBalance, checkBalance, transferBalance, transactionHistory } = require("../Controllers/balanceController");
const { checkToken } = require("../config/jwt-middleware");
const router = express.Router();

router.post("/addBalance", checkToken, addBalance)
router.post("/withdrawBalance", checkToken, withdrawBalance)
router.post("/checkBalance", checkToken, checkBalance)
router.post("/transferBalance", checkToken, transferBalance)
router.get("/transactionHistory", checkToken, transactionHistory)

module.exports = router;