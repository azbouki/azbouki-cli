const mysql = require('../../lib/mysqlConnection/MysqlConnection');
const HotelRepository = new (require('./HotelRepository'))(mysql);

module.exports = function HotelService() {

    function getHotelsByOfferId(offerId) {
        return HotelRepository.getListByOfferId(offerId).then(results => {
            return results;
        });
    }

    function addHotelsToOfferId(offerId) {
        return HotelRepository.addHotelsToOfferId(offerId).then(result => {
            return result;
        });
    }

    function removeHotelsByOfferId(offerId) {
        return HotelRepository.removeHotelsByOfferId(offerId).then(result => {
            return result;
        });
    }

    return {
        getHotelsByOfferId: getHotelsByOfferId,
        addHotelsToOfferId: addHotelsToOfferId,
        removeHotelsByOfferId: removeHotelsByOfferId
    };
}