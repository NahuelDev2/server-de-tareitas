const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) =>{

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty) return res.status(400).json({errores: errores.array()});

    const { email, password } = req.body
    try {
        //Validar que el usuario registrado sea único
        let usuario;
        usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json( {msg : 'El usuario ya existe'});
        }

        // Crea nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        //Guarda nuevo usuario
        await usuario.save();


        // Crear el JWT
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
        

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error al insertar usuario');
    }
}