const JwtConfig = require("./jwt-config");
const JWT = require('jsonwebtoken');

let checkToken = (req, res, next) => {
    let userToken = req.headers["authorization"];

    if (userToken) {
        // token value
        JWT.verify(userToken, JwtConfig.secret, {
            algorithm: JwtConfig.algorithm
        }, (error, data) => {
            if (error) {
                return res.status(500).json({
                    status: 0,
                    data: error,
                    message: "token is not valid"
                });
            } else {
                req.user = data;
                next();
            }
        })

    } else {
        return res.status(500).json({
            status: 0,
            message: "please provise authentication token value"

        });
    }
}



module.exports = {
    checkToken: checkToken

}