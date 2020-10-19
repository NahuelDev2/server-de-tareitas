const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) =>{

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty) return res.status(400).json({errores: errores.array()});

    //Extraer email y password del request
    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if (!usuario) return res.status(400).json({ msg: 'El usuario no existe '});

        //Revisar password

        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) return res.status(400).json({ msg: 'Password Incorrecto'});


        //Si es todo correcto seguimos.. Crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        //Firmar el web token

        jwt.sign(payload, process.env.SECRETA,{
            expiresIn:36000
        },
            (err, token) => {
            if (err) throw err;

            //Mensaje de confirmación
            res.status(200).json( { token });
            
        });

    } catch (err) {
        console.log(err)
    }


}

//Obtiene que usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await (await Usuario.findById(req.usuario.id).select('-password'));
        res.json({usuario});
    } catch (err) {
        console.log(err);
        res.status(500).json({msg : 'Hubo un error'});
    }
}