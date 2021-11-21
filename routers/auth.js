const { Router } = require('express')
const { refreshAccessToken } = require("../controllers/auth")

const router = Router()

router.post("/refresh-access-token", refreshAccessToken)

module.exports = router