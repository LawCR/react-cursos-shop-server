const { Router } = require('express')
const { suscribeEmail, getSuscribe } = require('../controllers/newsletter')
const router = Router()

router.post('/suscribe-newsletter/:email',suscribeEmail)

router.get('/get-suscribe', getSuscribe)
module.exports = router