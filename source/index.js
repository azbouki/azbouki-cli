const mysql = require('../../lib/mysqlConnection/MysqlConnection');
// config = require('../../config/config');

module.exports = function () {

    const HotelRepository = new (require('./HotelRepository'))(mysql),
        HotelController = new (require('./HotelController'))(HotelRepository);

    return require('./HotelRoutes')(HotelController);
};