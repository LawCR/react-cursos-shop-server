const { Router } = require('express')
const { check } = require('express-validator');
const multipart  = require('connect-multiparty')
const md_upload_avatar = multipart({ uploadDir: "./uploads/avatar"})
const { 
    signUp, signIn, getUsers,
    getUsersActive, uploadAvatar, getAvatar, 
    updateUser, activateUser, deleteUser, 
    signUpAdmin
    } = require('../controllers/user')
const { ensureAuth } = require('../middleware/authenticated')

const router = Router()


router.post("/sign-up", signUp)
router.post('/sign-in', signIn)

// Solo para usuarios logeados
router.get("/users", [ensureAuth], getUsers)

// Mostrar los usuarios activos o inactivos segun el query - solo para usuarios logeados
router.get("/users-active", [ensureAuth], getUsersActive)

// Actualizar el avatar del usuario
router.put('/upload-avatar/:id', [ensureAuth, md_upload_avatar], uploadAvatar)

// Obtener path e imagen del avatar
router.get('/get-avatar/:avatarName', getAvatar)

// Actualizar datos usuario
router.put('/update-user/:id',[ensureAuth], updateUser)

router.put('/activate-user/:id',[ensureAuth],activateUser)

router.delete('/delete-user/:id', [ensureAuth], deleteUser)

router.post('/sign-up-admin', [
    ensureAuth,
    check('email').isEmail().withMessage({message: 'El correo no es valido'}),
], signUpAdmin)


module.exports = router