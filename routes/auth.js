// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
// Autentica un usuario

// api/auth
//Iniciar sesión
const { check } = require('express-validator');


router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'La contraseña debe ser de al menos 6 carácteres').isLength({min: 6})

    ]
    ,
    authController.autenticarUsuario
);

//Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);
module.exports = router;