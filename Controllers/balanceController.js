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
    }).then((data) => {
        if (data[0]) {
            res.status(200).json({
                status: 1, // balance1
                message: "balance added successfully"
            });
        } else {
            res.status(500).json({
                status: 0,
                message: "something went wrong"
            });
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).json({
            status: 0,
            message: "failed to update user",
            data: error
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
    }).then((data) => {
        if (data[0]) {
            res.status(200).json({
                status: 1, // balance1
                message: "balance withdraw successfully"
            });
        } else {
            res.status(500).json({
                status: 0,
                message: "something went wrong"
            });
        }
    }).catch((error) => {
        // console.log(error);
        res.status(500).json({
            status: 0,
            message: "failed to update user",
            data: error
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
                message: "balance",
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
    let To = req.body.to;
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
                    id: req.body.to // to
                }
            }).then((user) => {
                if (user) {
                    Transaction.create({
                        date: Date.now(),
                        sender: req.user.id,
                        receiver: To,
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
                                    id: To
                                }
                            }).then((user) => {
                                if (user[0]) {
                                    Transaction.update({
                                        status: "success"
                                    }, {
                                        where: {
                                            id: newTransactionId
                                        }

                                    }).then((transactionStatus) => {
                                        if (transactionStatus[0]) {
                                            res.status(200).json({
                                                message: "Transaction Successful"
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
                message: "All Transactions Found",
                data: allTransactions,
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