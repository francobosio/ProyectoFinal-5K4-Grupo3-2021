import { RequestHandler } from "express";
import Usuario from "./Usuario";

export const createUsuario: RequestHandler = async (req, res) => {
    const { auth0_id, apellido, nombre, correo_electronico, avatar } = req.body;

    const newUsuario = {
        auth0_id,
        apellido,
        nombre,
        correo_electronico,
        tipoUsuario: "1",
        estado: "Activo",
        avatar,
    };

    const usuario = new Usuario(newUsuario);
    console.log(usuario);
    await usuario.save();
    return res.json({
        usuario
    });
}

export const getUsuario: RequestHandler = async (req, res) => {
    const auth0id = req.params.auth0id
    const queryUsuario = { auth0_id: auth0id }
    const usuarioFound = await Usuario.findOne(queryUsuario).exec();
    if (!usuarioFound) {
        return res.json(null);
    }
    return res.json(usuarioFound);
}

export const getUltimaPagina: RequestHandler = async (req, res) => {
    const auth0id = req.params.auth0id;
    const idLibro = req.params.idLibro;
    const queryUsuario = { auth0_id: auth0id }
    const usuario = await Usuario.findOne(queryUsuario).exec();
    if (usuario != undefined) {
        const libros_leidos = usuario.libros_leidos;
        const index = libros_leidos.findIndex(x => x.id_libro === idLibro);

        let ultimaPagina = 0;
        if (index > -1) {
            ultimaPagina = libros_leidos[index].ultima_pagina;
        }

        console.log("pagina encontrada");
        console.log(ultimaPagina)
        return res.json(ultimaPagina);
    } else {
        console.log(usuario)
        return res.json({
            message: "Usuario no existe"
        });
    }
}

export const putLibroPublicado: RequestHandler = async (req, res) => {
    const { auth0id, idLibro } = req.body;
    const queryUsuario = { auth0_id: auth0id }

    const usuario = await Usuario.findOne(queryUsuario).exec();
    usuario?.libros_publicados.push({ id_libro: idLibro });
    await usuario?.save();
    console.log("Modificado con éxito");
    console.log(usuario)
    return res.json({
        message: "Usuario modificado con éxito !!!"
    });
}

export const putLibroLeido: RequestHandler = async (req, res) => {
    let { auth0id, idLibro, ultimaPaginaLeida, finLectura } = req.body;
    const queryUsuario = { auth0_id: auth0id };

    let usuario = await Usuario.findOne(queryUsuario).exec();

    if (usuario != undefined) {
        const libros_leidos = usuario.libros_leidos;
        const index = libros_leidos.findIndex(x => x.id_libro === idLibro);

        if (finLectura) {
            libros_leidos.splice(index, 1);
        } else {
            if (index > -1) {
                ultimaPaginaLeida = usuario.libros_leidos[index].ultima_pagina;
                libros_leidos.splice(index, 1);
            } else {
                ultimaPaginaLeida = 0;
            }
        }

        const libroLeido = {
            id_libro: idLibro,
            ultima_pagina: ultimaPaginaLeida
        }
        usuario.libros_leidos.push(libroLeido);

        await usuario.save();

        console.log("Modificado con éxito");
        console.log(usuario)
        return res.json({
            message: "Usuario modificado con éxito !!!"
        });
    }
    console.log(usuario)
    return res.json({
        message: "Usuario no existe"
    });
}

//obtener todos los usuarios de la base de datos y devolverlos en un json con el formato de la base de datos de mongo db 
export const getUsuarios: RequestHandler = async (req, res) => {
    //usar $lookup para unir a usuario y tipoUsuario para obtener el tipo de usuario de cada usuario excluir los campos libros_leidos y libros_publicados
    const usuarios = await Usuario.aggregate([
        {
            $lookup: {
                from: "tipousuarios",
                localField: "tipoUsuario",
                foreignField: "id",
                as: "tipoUsuario"
            }
        },
        {
            $project: {
                libros_leidos: 0,
                libros_publicados: 0,
                correo_electronico: 0,
                createdAt: 0,
                updatedAt: 0,
                tipoUsuario: {
                    _id: 0,
                    createdAt: 0,
                    updatedAt: 0,
                }
            }
        }
    ]);
    return res.json(usuarios);
}

//modificar el tipo de usuario de un usuario en especifico
export const putTipoUsuario: RequestHandler = async (req, res) => {
    const { id, tipoUsuario } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(id, { tipoUsuario }, { new: true })
    //si el usuariio no existe devolver un mensaje de error en json
    if (!usuario) {
        return res.json({
            message: "Usuario no existe"
        });
    }
    return res.json({
        message: "Usuario modificado con éxito !!!",
        usuario
    });

}

export const putSuscribir: RequestHandler = async (req, res) => {
    console.log("hola")
    const { usuario_id, autor2 } = req.body;
    console.log("ACAAAAAAA" + autor2)
    const usuario = await Usuario.findById(autor2).exec();
    if (usuario != undefined) {
        usuario.suscriptores.push({usuario_id: usuario_id});
        await usuario.save();
        console.log("Suscripto con éxito");
        console.log(usuario)
        return res.json({
            message: "Usuario suscripto con éxito !!!"
        });
    }
    res.json({message: "Fallo al suscribir"});
}

export const putDesuscribir: RequestHandler = async (req, res) => {
    const { usuario_id, autor } = req.body;
    const usuario = await Usuario.findById(autor).exec();
    if (usuario != undefined) {
        const index = usuario.suscriptores.findIndex(x => x === usuario_id);
        usuario.suscriptores.splice(index, 1);
        await usuario.save();
        console.log("Desuscrito con éxito");
        return res.json({
            message: "Usuario desuscrito con éxito !!!"
        });
    }
}

export const buscarNombreSuscripcion: RequestHandler = async (req, res) => {
    const usuario_id= req.params.usuario_id;
    const autor = req.params.autor;
    const usuario = await Usuario.findById(autor).exec();
    if (usuario != undefined) {
        const estaSuscripto = usuario.suscriptores.map(x => x.usuario_id).includes(usuario_id);
        console.log(estaSuscripto)
        return res.json({
            estaSuscripto
        });
    }
}
