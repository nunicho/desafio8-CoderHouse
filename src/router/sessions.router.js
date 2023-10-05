const express = require("express");
//const mongoose = require("mongoose");
const router = express.Router();
const modeloUsuarios = require("../dao/DB/models/usuarios.modelo.js");

const crypto = require("crypto")

router.post("/registro", async (req, res) => {
  try {
    let { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.redirect(
        "/registro?error=Complete email, nombre, y contraseña"
      );
    }

    let existe = await modeloUsuarios.findOne({ email });
    if (existe) {
      return res.redirect(
        "/registro?error=" + `Usuario ya está registrado: ${email}`
      );
    }

    password = crypto
      .createHmac("sha256", "palabraSecreta")
      .update(password)
      .digest("base64");

    await modeloUsuarios.create({
      nombre,
      email,
      password,
    });

    res.redirect(`/login?usuarioCreado=${email}`);
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    //res.status(500).send("Ocurrió un error al registrar el usuario.");
    return res
      .status(500)
      .redirect("/login?error=Ocurrió un error al registrar el usuario");
  }
});

router.post('/login', async (req,res)=>{

    let {email, password} = req.body
    if(!email || !password){
        //return  res.status(400).send('faltan datos')
       return res.redirect("/login?error=Faltan datos");
    }

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.usuario = {
        nombre: "Coder",
        email: "adminCoder@coder.com",
        rol: "administrador",
      };

      //Se puso hardcodeado adminCoder@coder.com en el código de sessions.router.js porque no debía estar en la base de datos de usuarios.

      return res.redirect("/");
    }
    password = crypto
      .createHmac("sha256", "palabraSecreta")
      .update(password)
      .digest("base64");

    let usuario = await modeloUsuarios.findOne({email, password})
    if(!usuario){
        //return res.status(401).send('credenciales incorrectas')
        return res.redirect("/login?error=credenciales incorrectas");
    }

    req.session.usuario = {
      nombre: usuario.nombre,
      email: usuario.email,    
      rol: "usuario",
    };

    res.redirect('/')

   
})


router.get('/logout', (req, res) =>{
    req.session.destroy(e=>console.log(e))
    res.redirect('/login?mensaje=logout correcto!')
})

module.exports = router;
