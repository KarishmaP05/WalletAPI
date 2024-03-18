module.exports = {
    expiresIn: 40000, // it is 2 min
    notBefore: 2, // it is 2 sec
    audience: "site-users",
    secret: "WalletAPI",
    issuer: "Ms.Developer",
    algorithm: "HS384"

}