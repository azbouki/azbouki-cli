'use strict'

var mysql = require('../lib/mysqlConnection/MysqlConnection'),
    config = require('../config');

module.exports = function (app) {

    var UserRepository = new(require('./UserRepository'))(mysql),
        UserController = new (require('./UserController'))(UserRepository, app);

    return require ('./UserRoutes')(UserController);
};