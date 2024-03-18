const Sequelize = require('sequelize');

module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define("User", {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING(255)
        },
        email: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        status: {
            type: Sequelize.STRING(255),
            defaultValue: 1
        },
        balance: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        logincount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        lastlogin: {
            type: Sequelize.DATE,
        }
    });

    return User;
};