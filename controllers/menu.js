const Menu = require("../models/menu");

// Controlador para crear un menu
const addMenu = (req, res) => {
    const { title, url, order, active} = req.body
    const menu = new Menu({title, url, order, active})
    menu.save((err, createdMenu) => {
        if (err) {
            res.status(500).send({message: "Server error"})
        } else {
            if (!createdMenu) {
                res.status(404).send({message: "Error creating menu"})
            } else {
                res.status(200).send({message: "Menu created successfully"})
            }
        }
    })
}

// Controlador para obtener los menus
const getMenus = (req, res) => {
    Menu.find()
        .sort({order: "asc"})
        .then(menus => {
            if (!menus) {
                res.status(404).send({message: "Menu not found"})
            } else {
                res.status(200).send({menu: menus})
            }
        })
        .catch(err => {
            res.status(500).send({message: err})
        })
}
// Controlador para actualizar el menu
const updateMenu = (req, res) => {
    let menuData = req.body
    const { id } = req.params

    Menu.findByIdAndUpdate(id, menuData, (err, menuUpdate) => {
        if (err) {
            res.status(500).send({message: "Server Error"})
        } else {
            if (!menuUpdate) {
                res.status(404).send({message: "Menu not found"})
            } else {
                res.status(200).send({message: "Menu updated successfully"})
            }
        }
    })
}

// Controlador para activar el menu o desactivarlo
const activateMenu = (req, res) => {
    const { id } = req.params
    const {active} = req.body
    Menu.findByIdAndUpdate(id, {active}, (err, menuUpdated) => {
        if (err) {
            res.status(500).send({message: "Server Error, try again later"})
        } else {
            if (!menuUpdated) {
                res.status(404).send({message: "Menu not found"})
            } else {
                if (active === true) {
                    res.status(200).send({message: "Menu has been activated successfully"})
                } else {
                    res.status(200).send({message:"Menu has been desactivated successfully"})
                }
            }
        }
    })
}

// Controlador para eliminar el menu
const deleteMenu = (req,res) => {
    const { id } = req.params
    Menu.findByIdAndDelete(id, (err, menuDeleted) => {
        if (err) {
            res.status(500).send({message: "Server Error, try again later"})
        } else {
            if (!menuDeleted) {
                res.status(404).send({message: "Menu not found"})
            } else {
                res.status(200).send({message:"Menu has been removed successfully"})
            }
        }
    })
}

module.exports = {
    addMenu,
    getMenus,
    updateMenu,
    activateMenu,
    deleteMenu
}