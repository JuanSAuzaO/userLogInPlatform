require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const initializePassport = require('./passportConfig');

initializePassport(passport);

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded());
app.use(require('./routes.js'));
app.use(express.static(__dirname));
app.use(
  session({
    secret: "secret",

    resave: false,

    saveUninitialized: false
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

let message= "";

app.get('/Crear_cuenta', (req,res) => {
  res.render("signup");
});

app.get('/Iniciar_sesion',(req,res) => {
  res.render("signin");
});

app.get('/Recuperacion_contrasena', (req, res) => {
  res.render("PWRecovery", { message });
});

app.get(`/PWC?`, (req, res) => {
  res.render('PWchange');
})

app.post('/Iniciar_sesion', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: true,
  failureRedirect: 'Iniciar_sesion',
  failureFlash: true
})
);

const port= process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Application started and Listening on port ${port}`);
});