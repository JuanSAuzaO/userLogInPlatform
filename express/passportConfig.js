const LocalStrategy = require('passport-local').Strategy;
const { Pool } = require('pg');
const bcrypt = require("bcrypt");

const pool = new Pool ({
    user:'postgres',
    host:'localhost',
    password:'samplePassword',
    database:'library',
    port:'5432'
});

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        email1 = email.toLowerCase();
        pool.query('SELECT * FROM usuarios WHERE email = $1', [email1], (err, results) => {
            if (err) {
                throw err;
            }
            if (results.rows.length > 0) {
                const user = results.rows[0];
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (isMatch) {
                        logMessage = user.nombre;
                        return done (null, user, { message:logMessage });
                    } else {
                        return done (null, false, {  message:"Datos no válidos" });
                    }
                });
            } else {
                return done (null, false, {  message:"Datos no válidos" });
            }
        });
    };
    passport.use(
        new LocalStrategy({
                usernameField: "email",
                passwordField: "password"
            }, 
            authenticateUser
        )
    );
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        pool.query('SELECT * FROM usuarios WHERE id=$1',[id], (err, results) => {
            if (err) {
                throw err;
            }
            return done(null, results.rows[0]);
        });
    });
};

module.exports = initialize;