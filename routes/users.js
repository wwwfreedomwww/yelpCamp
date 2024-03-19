const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const { registerForm, register, loginForm, login, logout } = require('../controllers/users')
const passport = require('passport')
const { storeReturnTo } = require('../middleware');

router.get('/register', registerForm)

router.post('/register', wrapAsync(register))

router.get('/login', loginForm)

router.post('/login', 
            storeReturnTo, 
            passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), 
            wrapAsync(login))

router.get('/logout', logout); 


module.exports = router