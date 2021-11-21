const jwt = require('../services/jwt')
const moment = require('moment')
const User = require('../models/user')

// Devover true si no ha expirado el token sino devuelve false
const willExpiredToken = (token) => {
    const {exp} = jwt.decodeToken(token)
    const currentDate = moment().unix()

    if (currentDate > exp) {
        return true
    }
    return false
}

// El refresh token creara un nuevo AccessToken siempre y cuando no este expirado o no exista el usuario
const refreshAccessToken = (req, res) => {
    const {refreshToken} = req.body
    const isTokenExpired = willExpiredToken(refreshToken)
    if (isTokenExpired) {
        res.status(404).send({message: "RefreshToken has expired"})
    } else {
        // Buscamos al usuario por el id que tiene nuestro token
        const { id } = jwt.decodeToken(refreshToken)
        User.findOne({_id: id}, (err, userStored) => {
            if(err) {
                res.status(500).send({message: "Server Error"})
            } else {
                if (!userStored) {
                    res.status(404).send({message:"User not found"})
                } else {
                    res.status(200).send({
                        accessToken: jwt.createAccesstoken(userStored),
                        refreshToken: refreshToken
                    })
                }
            }
        })
    }
}

module.exports = {
    willExpiredToken,
    refreshAccessToken
}