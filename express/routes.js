const { Router } = require('express');
const router = Router();

const { createUser, pwRecovery, pwChange } = require('./index.controller.js')

router.post('/Crear_cuenta', createUser);

router.post('/Recuperacion_Contrasena', pwRecovery)

router.post('/PWC?', pwChange)

module.exports = router;

