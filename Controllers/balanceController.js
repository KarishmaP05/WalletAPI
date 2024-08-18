const { Op } = require("sequelize");
const { sequelize } = require("../models");

const User = require("../models").User
const Transaction = require("../models").Transaction

// add balance in account

exports.addBalance = (req, res) => {
    User.update({
            balance: sequelize.literal('balance +' + req.body.balance)
        }, {
            where: {
                id: req.user.id
            }
        })
        .then((data) => {
            if (data[0]) {
                // Fetch the updated user balance
                return User.findOne({
                    where: { id: req.user.id },
                    attributes: ['balance']
                });
            } else {
                res.status(500).json({
                    status: 0,
                    message: "Failed to add balance"
                });
                return null;
            }
        })
        .then((updatedUser) => {
            if (updatedUser) {
                const totalBalance = updatedUser.balance;
                console.log("Total Balance:", totalBalance);
                res.status(200).json({
                    status: 1,
                    message: "Balance added successfully",
                    data: req.body.balance,
                    TotalBalance: totalBalance
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                status: 0,
                message: "An error occurred while adding balance",
                error: error.message
            });
        });
}

// withdraw money from account

exports.withdrawBalance = (req, res) => {
    User.update({
            balance: sequelize.literal('balance -' + req.body.balance)
        }, {
            where: {
                id: req.user.id
            }
        })
        .then((data) => {
            if (data[0]) {
                // Fetch the updated user balance
                return User.findOne({
                    where: { id: req.user.id },
                    attributes: ['balance']
                });
            } else {
                res.status(500).json({
                    status: 0,
                    message: "Failed to withdraw balance"
                });
                return null;
            }
        })
        .then((updatedUser) => {
            if (updatedUser) {
                const totalBalance = updatedUser.balance;
                console.log("Total Balance:", totalBalance);
                res.status(200).json({
                    status: 1,
                    message: "Balance Withdraw successfully",
                    data: req.body.balance,
                    TotalBalance: totalBalance
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                status: 0,
                message: "An error occurred while Withdraw balance",
                error: error.message
            });
        });
}

// check balance

exports.checkBalance = (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    }).then((user) => {
        if (user) {
            res.status(200).json({
                status: 1,
                message: "User balance",
                data: user.balance
            })

        } else {
            res.status(500).json({
                status: 0,
                message: "user does not exist"
            })

        }



    }).catch((error) => {
        res.status(500).json({
            status: 0,
            message: "failed to check balance",
            data: error
        });


    });

}



// transfer money

exports.transferBalance = (req, res) => {
    let MobileNo = req.body.mobileno;
    let Amount = req.body.amount;
    let Reason = req.body.reason;

    let newTransactionId;

    User.findOne({
        where: {
            id: req.user.id
        }
    }).then((user) => {
        console.log(user);
        if (user.balance >= Amount) {
            // sufficient balance
            User.findOne({
                where: {
                    mobileno: req.body.mobileno // to
                }
            }).then((user) => {
                if (user) {
                    console.log("receiver id is", user.id);
                    Transaction.create({
                        date: Date.now(),
                        sender: req.user.id,
                        receiver: user.id,
                        amount: Amount,
                        reason: Reason
                    }).then((newTransaction) => {
                        newTransactionId = newTransaction.id;
                    })

                    User.update({
                        balance: sequelize.literal('balance -' + Amount)
                    }, {
                        where: {
                            id: req.user.id
                        }
                    }).then((user) => {
                        if (user[0]) { // balance deducted
                            User.update({
                                balance: sequelize.literal('balance +' + Amount)
                            }, {
                                where: {
                                    mobileno: MobileNo
                                }
                            }).then((user) => {
                                if (user[0]) {
                                    Transaction.update({
                                        status: "success"
                                    }, {
                                        where: {
                                            id: newTransactionId
                                        }
                                    }).then((data) => {
                                        console.log("data is", data);
                                        if (data[0]) {
                                            // Fetch the updated user balance
                                            return User.findOne({
                                                where: { id: req.user.id },
                                                attributes: ['balance']
                                            });
                                        }
                                    }).then((updatedUser) => {
                                        console.log("updatedUser", updatedUser)
                                        if (updatedUser) {
                                            const totalBalance = updatedUser.balance;
                                            console.log("Total Balance:", totalBalance);
                                            res.status(200).json({
                                                message: `Transaction Successful of Rs ${Amount}`,
                                                DebitedAmount: Amount,
                                                TotalBalance: totalBalance
                                            })
                                        } else {
                                            res.status(400).json({
                                                message: "Transaction failed"
                                            })
                                        }
                                    })
                                } else {
                                    res.status(400).json({
                                        message: "failed to credit balance"
                                    })

                                }


                            })
                        } else {
                            res.status(400).json({
                                message: "failed to deduct balance"
                            })
                        }

                    })

                } else {
                    res.status(404).json({
                        status: 0,
                        message: "receiver not found"
                    })
                }


            })

        } else {
            res.status(500).json({
                status: 0,
                message: "Insufficient Balance",
                data: user.balance
            })

        }
    })

}


// display all transaction history of requested user

exports.transactionHistory = (req, res) => {

    Transaction.findAll({
        where: {
            [Op.or]: [{ sender: req.user.id }, { receiver: req.user.id }]
        }

    }).then((allTransactions) => {
        console.log(allTransactions);
        if (allTransactions.length > 0) {
            res.status(200).json({
                TotalNumberOfTransactions: allTransactions.length,
                message: "All Transactions Found",
                data: allTransactions
            });

        } else {
            res.status(500).json({
                message: "No Transactions Found"
            });


        }
    }).catch((error) => {
        res.status(500).json({
            status: 0,
            message: "failed to display Transaction",
            data: error
        });
    })

}