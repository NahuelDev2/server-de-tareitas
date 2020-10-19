// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
// Crea un usuario
// ap/usuarios

const { check } = require('express-validator');


router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'La contraseña debe ser de al menos 6 carácteres').isLength({min: 6})

    ]
    ,
    usuarioController.crearUsuario
);

module.exports = router;