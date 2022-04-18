const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();

const pool = new Pool ({
    user:'postgres',
    host:'localhost',
    password:'samplePassword',
    database:'library',
    port:'5432'
});

const createUser = async (req, res) => {
    const { nombre, email, password, password2 } = req.body;
    email1 = email.toLowerCase();
    const response = await pool.query('SELECT * FROM usuarios WHERE email =$1', [email1]);
    let errors = [];
    if (!email.includes("@") || !email.includes(".")) {
        errors.push({ message:"El email debe contener un @ y/o un servidor"})
        return res.render("signup", { errors });
    } else if (response.rows.length > 0) {
        errors.push({ message: "El email ya está registrado" });
        res.render("signup", { errors }); 
    } else if (password.length < 8) {
        errors.push({ message: "La contraseña debe contener mínimo 8 caracteres"});
        res.render("signup", { errors });
    } else if (password != password2) {
        errors.push({ message: "Error: Las contraseñas no coinciden" });
        res.render("signup", { errors });
    } else if (password == password2) {
        let hashedPassword = await bcrypt.hash(password, 8);
        const response = await pool.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1,$2,$3)', [nombre, email1, hashedPassword],
        (err, results) => {
            if (err) {
                throw err;
            }
            res.redirect("/Iniciar_sesion");
        })
    }
};

const pwRecovery = async (req, res) => {
    const { email } = req.body;
    globalThis.email1 = email.toLowerCase();
    const response = await pool.query('SELECT * FROM usuarios WHERE email=$1', [email1]);
    if (response.rows.length > 0) {
         const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sampleMail@gmail.com',
                pass: 'samplePassword'
            }  
        })
        const mailOptions = {
            from: 'sampleMail@gmail.com',
            to: email1,
            subject: 'RECUPERAR CONTRASEÑA DE S.Y.F',
            text: `POR FAVOR, HAGA CLICK EN EL SIGUIENTE LINK, PARA RECUPERAR SU CONTRASEÑA: http://localhost:5000/PWC?${email1}`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        }) 
        res.render("PWRecovery", { message:"Mensaje enviado exitosamente"});
    } else {
        res.render("PWRecovery", { message:"Verifique el correo ingresado"});
    }
}
const pwChange = async (req, res) => {
    const { password, password2} = req.body;
    let errors = [];
    if (password.length < 8) {
        errors.push({ message: "La contraseña debe contener mínimo 8 caracteres"});
        res.render("PWChange", { errors });
    } else if (password != password2) {
            errors.push({ message: "Error: Las contraseñas no coinciden" });
            res.render("PWChange", { errors });
    } else if (password == password2) {
        let hashedPassword = await bcrypt.hash(password, 8);
        const response = await pool.query('UPDATE usuarios SET password=$1 WHERE email=$2',[hashedPassword, email1], (err, results) => {
            if (err) {
                throw err;
            }
            res.redirect("/Iniciar_Sesion")
        }); 
    } 
}
module.exports = {
    createUser,
    pwRecovery,
    pwChange,
};