const jwt = require('jwt-simple')
const moment = require('moment')

// Función para crear el accessToken
const createAccesstoken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        createToken: moment().unix(),
        exp: moment().add(3, "hours").unix()
    }

    return jwt.encode(payload, process.env.SECRET_KEY)
}

// Función para crear el refreshToken
const createRefreshToken = (user) => {
    const payload = {
        id: user._id,
        exp: moment().add(30, "days").unix()
    }

    return jwt.encode(payload, process.env.SECRET_KEY)
}

// Función para decodificar un token con nuestra clase secreta
const decodeToken = (token) => {
    return jwt.decode(token, process.env.SECRET_KEY, true)
}

module.exports = {
    createAccesstoken,
    createRefreshToken,
    decodeToken
}