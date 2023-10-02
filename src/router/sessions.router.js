const express = require("express");
//const mongoose = require("mongoose");
const router = express.Router();
const modeloUsuarios = require("../dao/DB/models/usuarios.modelo.js");

const crypto = require("crypto")

router.post('/registro', async (req,res)=>{

    let {nombre, email, password} = req.body

    if(!nombre || !email || !password){
        return res.status(400).send('faltan datos')
    }

    let existe = await modeloUsuarios.findOne({email})
    if(existe){
        return res.status(400).send(`Usuario ya está registrado: ${email}`);
    }

    password = crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    await modeloUsuarios.create({
        nombre,email, password
    })

    // ACA SE PUEDE AGREGAR UN TRY CATCH

    res.redirect(`/login?usuarioCreado=${email}`)

    //MENSAJE EN VERDE QUE DIGA "SE HA CREADO UN USUARIO"
})

router.post('/login', async (req,res)=>{

    let {email, password} = req.body
    if(!email || !password){
        return  res.send('faltan datos')
    }


    password = crypto
      .createHmac("sha256", "palabraSecreta")
      .update(password)
      .digest("base64");

    let usuario = await modeloUsuarios.findOne({email, password})
    if(!usuario){
        return res.status(401).send('credenciales incorrectas')
    }

    req.session.usuario = {
        nombre: usuario.nombre,
        email: usuario.email
    }

    res.redirect('/')

   
})


router.get('/logout', (req, res) =>{
    req.session.destroy(e=>console.log(e))
    res.redirect('/login?mensaje=logout correcto!')
})

module.exports = router;
