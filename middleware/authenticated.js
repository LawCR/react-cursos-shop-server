const jwt = require('jwt-simple')
const moment = require('moment')

// Middelware para validar que sea un usuario con token valido
const ensureAuth = (req, res, next) => {
    // Recibimos la cabecera
    const authorization = req.header('authorization');
    // Para validar si tiene el header puesto
    if (!authorization) {
        return res.status(403).send({message: "La peticion no tiene cabecera de Autenticacion"})
    }

    // Limpiar el campo del token por seguridad.
    const token = authorization.replace(/['"]+/g, "")
    try {
        var payload = jwt.decode(token, process.env.SECRET_KEY)
        // Para validar si el tiempo de expiracion es menor a la hora actual
        if (payload.exp <= moment.unix) {
            return res.status(404).send({message: "El token ha expirado"})
        }
    } catch (error) {
        // Error si es un token no valido
        return res.status(404).send({message: "Invalid Token"})
    }
    
    req.user = payload
    next() 
}

module.exports = {
    ensureAuth
}