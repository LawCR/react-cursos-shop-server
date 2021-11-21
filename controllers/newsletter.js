const Newsletter = require('../models/newsletter')

// Controlador para registrar los suscripciones por email
const suscribeEmail = (req, res) => {
    const {email} = req.params
    const newsletter = new Newsletter()
    if (!email) {
        res.status(404).send({code: 404, message:"Email is required"})
    } else {
        newsletter.email = email.toLowerCase()
        newsletter.save((err, newsletterStored) => {
            if (err) {
                res.status(500).send({code: 500, message:"This email already exists"})
            }else {
                if (!newsletterStored) {
                    res.status(404).send({code: 404, message:"Error creating newsletter"})
                } else {
                    res.status(200).send({code: 200, message:"Email registered successfully"})
                }
            }
        })
    }
}

// Controlador para obtener la suscripción del email
const getSuscribe = (req,res) => {
    Newsletter.find().then(newsletters => {
        if (!newsletters) {
            res.status(404).send({ message: "No user found"})
        }else {
            res.status(200).send({ newsletters })
        }
    })
}

module.exports = {
    suscribeEmail,
    getSuscribe
}