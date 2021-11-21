const { Router } = require('express')
const { addMenu, getMenus, updateMenu, activateMenu, deleteMenu } = require('../controllers/menu')
const { ensureAuth } = require('../middleware/authenticated')
const router = Router()

router.post('/add-menu', [ensureAuth], addMenu)

router.get('/get-menus', getMenus)

router.put('/update-menu/:id', [ensureAuth], updateMenu)

router.put('/activate-menu/:id', [ensureAuth], activateMenu)

router.delete('/delete-menu/:id', [ensureAuth], deleteMenu)

module.exports = router