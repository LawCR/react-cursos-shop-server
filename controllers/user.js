const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('../services/jwt')
const User = require('../models/user')

// Controlador para el registro de usuarios
const signUp = (req,res) => {
    const { name, lastname, email, password, repeatPassword} = req.body
    const user = new User({name,lastname,password})
    user.email = email.toLowerCase()
    user.role = "admin"
    user.active = false

    if (!password || !repeatPassword) {
        res.status(404).send({message: "Passwords are required"})
    }else {
        if (password !== repeatPassword){
            res.status(404).send({message: "Passwords do not match"})
        }else{
            // Encriptamos el password
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) {
                        res.status(500).send({message:"Password encryption failed"})
                    } else {
                        user.password = hash
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({message:"The user with this email already exists"})
                            }else {
                                if (!userStored) {
                                    res.status(404).send({message:"Error creating user"})
                                } else {
                                    res.status(200).send({user:userStored})
                                }
                            }
                        })
                    }
                });
            });
        }
    }
}
   
// Controlador para el login de usuarios
const signIn = (req, res) => {
    const params = req.body
    const email = params.email.toLowerCase()
    const password = params.password
    User.findOne({email}, (err, userStored)=>{ 
        if (err) {
            res.status(500).send({message: "Server error findOne"})
        } else {
            if (!userStored) {
                res.status(404).send({message: "User not found"})
            } else {
                //Comparamos las password que ingresamos con la de la bd encriptadas
                bcrypt.compare(password, userStored.password, (err, check)=>{
                    if (err) {
                        res.status(500).send({message:"Server error bcript"})
                    } else if(!check) {
                        res.status(404).send({message:"Password is incorrect"})
                    }
                    else {
                        if (!userStored.active) {
                            res.status(200).send({code: 200, message: "User account has not been activated"})
                        } else {
                            res.status(200).send({
                                accessToken: jwt.createAccesstoken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            })
                        }
                    }
                })
            }
        }
    })
}

// Controlador para listar todos los usuarios con un token valido
const getUsers = (req, res) => {
    User.find().then(users => {
        if (!users) {
            res.status(404).send({ message: "No user found"})
        }else {
            res.status(200).send({ users })
        }
    })
}

// Controlador para listar todos los usuarios activos o inactivos con un token valido
const getUsersActive = (req, res) => {
    // Obtenemos el active de los querys y buscamos a los usuarios que esten con el active mandado
    const {active} = req.query
    User.find({active: active}).then(users => {
        if (!users) {
            res.status(404).send({ message: "No user found"})
        }else {
            res.status(200).send({ users })
        }
    })
}

// Controlador para actualizar el avatar
const uploadAvatar = (req, res) => {
    const {id} = req.params
    User.findById({_id: id}, (err, userData) => {
        if (err) {
            res.status(500).send({message:"Server Error"})
        } else {
            if (!userData) {
                res.status(404).send({message: "User not found"})
            } else {
                let user = userData
                if (req.files) {
                    // el path completo
                    let filePath = req.files.avatar.path
                    // El path dividido en slashes en un array
                    let fileSplit = filePath.split("\\")
                    // Agarramos el nombre de el path
                    let fileName = fileSplit[2]
                    // Del nombre separamos el nombre de la extension
                    let extSplit = fileName.split(".")
                    // Obtenemos la extension
                    let fileExt = extSplit[1]
                    if (fileExt !== "png" && fileExt !== "jpg") {
                        res.status(400).send({message: "La extension de la imagen no es valida. (Extensiones Permitidas: .png y .jpg)"})
                    } else {
                        user.avatar = fileName
                        User.findByIdAndUpdate({_id: id}, user, (err, userResult) =>{
                            if (err) {
                                res.status(500).send({message: "Server Error"})
                            } else {
                                if (!userResult) {
                                    res.status(404).send({message: "User not found"})
                                } else {
                                    res.status(200).send({
                                        user: userResult,
                                        avatarName: fileName})
                                }
                            }
                        })
                    }
                }
            }
        } 
    })
}

// Controlador para obtener la url del avatar y envia su imagen
const getAvatar = (req, res) => {
    const {avatarName} = req.params
    const filePath = "./uploads/avatar/" + avatarName
    // Primero se valida si existe la imagen (path)
    const existPath = fs.existsSync(filePath)
    if (!existPath) {
        res.status(404).send({message: "El avatar que buscas no existeee"})
    } else {
        res.sendFile(path.resolve(filePath))
    }
}

// Controlador para actualizar todos los datos del usuario
const updateUser = (req, res) => {
    let userData = req.body
    userData.email = req.body.email.toLowerCase()
    const { id } = req.params
    if (userData.password) {
        const salt = bcrypt.genSaltSync(10)
        userData.password = bcrypt.hashSync(userData.password,salt)
      /*  bcrypt.genSalt(10, function(err, salt) {
             bcrypt.hash(userData.password, salt, function(err, hash) {
                if (err) {
                    res.status(500).send({message:"Password encryption failed"})
                } else {
                    userData.password = hash
                    console.log(userData.password);
                }
            });
        });*/
    }
    User.findByIdAndUpdate({_id: id}, userData, (err,userUpdate) => {
        if (err) {
            res.status(500).send({message: "Server Error"})
        } else {
            if (!userUpdate) {
                res.status(404).send({message: "User not found"})
            } else {
                res.status(200).send({message: "User updated successfully"})
            }
        }
    })
}

// Controlador para activar y desactivar un usuario
const activateUser = (req, res) => {
    const { id } = req.params
    const { active } = req.body
    
    User.findByIdAndUpdate(id, {active}, (err, userStored) => {
        if (err) {
            res.status(500).send({message: "Server error"})
        } else {
            if (!userStored) {
                res.status(404).send({message: "User not found"})
            } else {
                if (active === true) {
                    res.status(200).send({message: "User has been successfully activated"})
                } else {
                    res.status(200).send({message: "User has been successfully desactivated"})
                }
            }
        }
    })
}

// Controlador para eliminar un usuario
const deleteUser = (req, res) => {
    const { id } = req.params
    User.findByIdAndRemove(id, (err, userDeleted)=> {
        if (err) {
            res.status(500).send({message: "Server error"})
        } else {
            if (!userDeleted) {
                res.status(404).send({message: "User not found"})
            } else {
                res.status(200).send({message: "User has been removed successfully"})
            }
        }
    })
}

// Controlador para crear usuarios desde el panel admin
const signUpAdmin = (req, res) => {
    const user = new User()
    const { name, lastname, email, role, password, repeatPassword} = req.body
    user.name = name
    user.lastname = lastname
    user.email = email
    user.role = role
    user.active = true
    
    if (!password || !repeatPassword) {
        res.status(404).send({message: "Passwords are required"})
    }else {
        if (password !== repeatPassword){
            res.status(404).send({message: "Passwords do not match"})
        }else{
            // Encriptamos el password
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) {
                        res.status(500).send({message:"Password encryption failed"})
                    } else {
                        user.password = hash
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({message:"The user with this email already exists"})
                            }else {
                                if (!userStored) {
                                    res.status(404).send({message:"Error creating user"})
                                } else {
                                    //res.status(200).send({user:userStored})
                                    res.status(200).send({message: "Successfully registered user"})
                                }
                            }
                        })
                    }
                });
            });
        }
    }
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    signUpAdmin
}