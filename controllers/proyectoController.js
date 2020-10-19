const Proyecto = require('../models/Proyecto');
const proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');

exports.crearProyecto = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty) return res.status(400).json({errores: errores.array()});

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id

        //Guardar proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error')
    }
}

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req,res) =>{
    try {
        const proyectos = await Proyecto.find({ creador : req.usuario.id});
        res.json({proyectos});
    } catch (err) {
        console.log(err);
        res.status(500).json({msg: 'Hubo un error'});
    }
}

//Actualiza un proyecto
exports.actualizarProyecto = async (req, res ) => {
    //Revisar si hay errores
    
    const errores = validationResult(req);
    if( !errores.isEmpty() ) return res.status(400).json({errores: errores.array() });

    //Extraer información del proyecto

    const { nombre } = req.body;
    const nuevoProyecto = {};
    
    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el ID

        //Se chequea si es un string de 12 bytes o un string de 24 hexadecimales
        if(!Types.ObjectId.isValid(req.params.id)) return res.status(400).json({msg: 'El id del proyecto no es un string válido'});

        //Si el proyecto existe o no
        let proyecto = await Proyecto.findById(req.params.id);

        if (!proyecto) return res.status(404).json({msg : "Proyecto no encontrado"});

        //Verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg: "No autorizado"});
        //Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set : nuevoProyecto }, { new: true });
        res.json({proyecto});
    } catch (err) {
        console.log(err);
        res.status(500).json({msg: 'Hubo un error'});
    }
}

//Elimina un proyecto por su ID
exports.eliminarProyecto = async (req, res ) => {

    try {
        //Revisar el ID

            //Primero se chequea si es un string de 12 bytes o un string de 24 hexadecimales
        if(!Types.ObjectId.isValid(req.params.id)) return res.status(400).json({msg: 'El id del proyecto no es un string válido'});

            //Después si el proyecto existe o no
        let proyecto = await Proyecto.findById(req.params.id);

        if (!proyecto) return res.status(404).json({msg : "Proyecto no encontrado"});

        //Verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg: "No autorizado"});

        //Eliminar proyecto de la DB
        await Proyecto.findOneAndRemove({_id : req.params.id });
        res.json({msg: 'Proyecto eliminado correctamente'});
    } catch (err) {
        console.log(err);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
