const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');

// Crear una nueva tarea
exports.crearTarea = async (req, res) =>{
    //Revisar si hay errores
    
    const errores = validationResult(req);
    if( !errores.isEmpty() ) return res.status(400).json({errores: errores.array() });

    
    try {
        //Extraer el proyecto y comprobar que existe
        
        //Tomamos el proyecto de la request
        const { proyecto } = req.body;

        //Se chequea si es un string de 12 bytes o un string de 24 hexadecimales
        
        if(!Types.ObjectId.isValid(proyecto)) return res.status(400).json({msg: 'El id del proyecto no es un string válido'});

        //Si el proyecto existe o no
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) return res.status(404).json({msg : "Proyecto no encontrado"});


        //Revisar si el proyecto actual pertenece al usuario
        if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg : 'Acceso no autorizado'});

        //Creamos la tarea
        
        const tarea = new Tarea(req.body);
        await tarea.save()
        res.json({ tarea });

    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error');
    }
}

// Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) =>{
    try {
        //Extraer el proyecto y comprobar que existe
        
        //Tomamos el proyecto de la request
        const { proyecto } = req.query;

        //Se chequea si es un string de 12 bytes o un string de 24 hexadecimales
        
        if(!Types.ObjectId.isValid(proyecto)) return res.status(400).json({msg: 'El id del proyecto no es un string válido'});

        //Si el proyecto existe o no
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) return res.status(404).json({msg : "Proyecto no encontrado"});

        //Revisar si el proyecto actual pertenece al usuario
        if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg : 'Acceso no autorizado'});


        //Obtener tareas por proyecto
        const tareas = await Tarea.find({ proyecto });
        res.json({tareas});
    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error');
    }

}

//Cambiar el estado de una tarea
exports.actualizarTarea = async (req,res) => {
    try {
         //Extraer el proyecto y comprobar que existe
        
        //Tomamos el proyecto de la request
        const { proyecto, nombre, estado } = req.body;

        //Se chequea si es un string de 12 bytes o un string de 24 hexadecimales
        
        if(!Types.ObjectId.isValid(proyecto)) return res.status(400).json({msg: 'El id del proyecto no es un string válido'});

        //Si el proyecto existe o no
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) return res.status(404).json({msg : "Proyecto no encontrado"});


        //Revisar si el proyecto actual pertenece al usuario
        if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg : 'Acceso no autorizado'});


        //Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) return res.status(404).json({msg : "Tarea no encontrada"});


        //Crear objeto con la nueva información
        const nuevaTarea = {}
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la tarea

        tarea = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, {new : true});
        res.json({tarea});

    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error');
    }
}

//Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar que existe
       
       //Tomamos el proyecto de la request
       const { proyecto } = req.query;

       //Se chequea si es un string de 12 bytes o un string de 24 hexadecimales
       
       if(!Types.ObjectId.isValid(proyecto)) return res.status(400).json({msg: 'El id del proyecto no es un string válido'});

       //Si el proyecto existe o no
       const existeProyecto = await Proyecto.findById(proyecto);

       if (!existeProyecto) return res.status(404).json({msg : "Proyecto no encontrado"});


       //Revisar si el proyecto actual pertenece al usuario
       if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg : 'Acceso no autorizado'});


       //Verificar si la tarea existe
       let tarea = await Tarea.findById(req.params.id);

       if(!tarea) return res.status(404).json({msg : "Tarea no encontrada"});

        //Eliminar tarea
        await Tarea.findOneAndDelete(req.params.id);
        res.json({msg : "Tarea eliminada correctamente"});

   } catch (err) {
       console.log(err);
       res.status(500).send('Hubo un error');
   }
}