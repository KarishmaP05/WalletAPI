const express = require("express");
const router = express.Router();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const app = express();
const userRoute = require("./routes/userRoute")

const balanceRoute = require("./routes/balanceRoute")

router.use(bodyParser.json());

// parse requests of content-type - application/json
app.use(express.json());

const db = require("./models");

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// simple route
app.use('/', userRoute)
app.use('/', balanceRoute)


// set port, listen for requests
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});