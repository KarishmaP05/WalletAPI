const Sequelize = require('sequelize');

module.exports = (sequelize, Sequelize) => {

    const Transaction = sequelize.define("Transaction", {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        date: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        sender: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        receiver: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        reason: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('pending', 'success'),
            defaultValue: "pending"
        }


    });

    return Transaction;
};