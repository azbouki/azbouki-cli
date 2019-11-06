'use strict'

var express = require('express');
var router = express.Router();
var jwtauth = require('./jwtAuth')();

module.exports = function(UserController){
    router.post('/register', UserController.register);
    router.post('/login', UserController.login);
    router.post('/reset-pass', UserController.resetPassword);
    router.post('/set-new-password', UserController.updatePassword);

    return router;
};