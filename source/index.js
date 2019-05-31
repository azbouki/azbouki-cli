const mysql = require('../../lib/mysqlConnection/MysqlConnection');

module.exports = function () {

    const PlaceholderRepository = new (require('./PlaceholderRepository'))(mysql),
        PlaceholderController = new (require('./PlaceholderController'))(PlaceholderRepository);

    return require('./PlaceholderRoutes')(PlaceholderController);
};