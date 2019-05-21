const moment = require('moment');
const Utils = require('../../lib/utils');
const async = require('async');

module.exports = function OfferRepository(mysql, config) {
    const selectHotelQuery = [
        `SELECT 
        H.*,
        HT.description,
        HT.pricing,
        HT.id AS translationId,
        HT.hotel_id AS hotelId,
        HT.language_code AS languageCode
    FROM`+ '`hotel` AS H',
        'LEFT JOIN `hotel_translation` AS HT',
        'ON HT.hotel_id = H.id'
    ].join(" ");

    function getList(data) {

        return mysql.makeQuery(selectHotelQuery, data, function (result) {
            return Utils.formatHotelsListFromDBResult(result);
        });
    }

    function getById(id) {
        const query = [
            selectHotelQuery,
            'WHERE H.id = :id',
        ].join(" ");

        return mysql.makeQuery(query, { id }, function (result) {
            return Utils.formatHotelsListFromDBResult(result);
        });
    }

    function getPhotos(id) {
        const query = [
            'SELECT id, hotel_id AS hotelId, path FROM `tour_agency`.`hotel_photos`',
            'WHERE hotel_id = :id',
        ].join(" ");

        return mysql.makeQuery(query, { id }, function (result) {
            return result;
        });
    }

    function create(data) {
        const query = [
            'INSERT INTO `hotel` (`name`, `stars`, `destination_id`)',
            'VALUES (:name, :stars, :destination);'
        ].join(" ");

        return mysql.makeQuery(query, data, function (result) {
            return result.insertId;
        });
    }

    function update(data) {
        const query = [
            'UPDATE hotel',
            'SET name = :name, stars = :stars, destination_id = :destination',
            'WHERE id = :hotelId'
        ].join(" ");

        data.hotelId = data.id;

        return mysql.makeQuery(query, data, function (result) {
            return result.affectedRows > 0;
        });
    }

    function createTranslations(translations) {

        let query = [
            'INSERT INTO `hotel_translation` (`hotel_id`, `language_code`, `description`, `pricing`)',
            'VALUES '
        ].join(" ");

        let values = [];
        translations.forEach(t => {
            values.push('(' + [t.hotelId, Utils.quotedString(t.languageCode), Utils.quotedString(t.description), Utils.quotedString(t.pricing)].join(', ') + ')');
        });

        query += values.join(', ') + ';';
        return mysql.makeQuery(query, null, function (result) {
            return result.affectedRows > 0;
        });
    }

    function deleteHotelTranslations(hotelId) {
        const query = [
            'DELETE FROM `hotel_translation`',
            'WHERE hotel_id=:hotelId;'
        ].join(" ");

        return mysql.makeQuery(query, {
            hotelId: hotelId
        }, function (result) {
            return result.warningCount == 0;
        });
    }

    function remove(hotelId) {
        const query = [
            'DELETE FROM `hotel`',
            'WHERE id=:hotelId;'
        ].join(" ");

        return mysql.makeQuery(query, {
            hotelId: hotelId
        }, function (result) {
            return result.warningCount == 0;
        });
    }

    function getListByOfferId(offerId) {
        const query = [
            selectHotelQuery,
            'LEFT JOIN',
            '`offers_has_hotel` AS OhasH ON OhasH.hotel_id = H.id',
            'WHERE OhasH.offers_id = :offerId',
            'ORDER BY H.id' // Order by Hotel.id
        ].join(" ");

        return mysql.makeQuery(query, { offerId }, function (result) {
            return Utils.formatHotelsListFromDBResult(result);
        });
    }

    function addHotelsToOfferId(hotelsIdList) {
        let query = [
            'INSERT INTO `offers_has_hotel` (`offers_id`, `hotel_id`) VALUES '
        ];
        hotelsIdList.forEach((item, index) => {
            query.push(`${index > 0 ? ',' : ''}(${item.offerId}, ${item.hotelId})`);
        });
        query = query.join(" ");

        return mysql.makeQuery(query, null, function (result) {
            return result.insertId;
        });
    }

    function removeHotelsByOfferId(offerId) {
        const query = [
            'DELETE FROM `offers_has_hotel`',
            'WHERE offers_id=:offerId;'
        ].join(" ");

        return mysql.makeQuery(query, {
            offerId: offerId
        }, function (result) {
            return result.warningCount == 0;
        });
    }

    function addPhotosToHotel(id, photos) {
        const HOTEL_PHOTOS_TABLE = 'hotel_photos';
        let query = [
            'INSERT INTO `' + HOTEL_PHOTOS_TABLE + '` (`hotel_id`, `path`)',
            'VALUES '
        ].join(" ");

        let values = [];
        photos.forEach(photo => {
            values.push(`('${id}', '${photo}')`);
        });

        query += values.join(', ') + ';';

        return mysql.makeQuery(query, null, function (result) {
            return result;
        });
    }

    function deletePhoto(id) {
        var query = [
            'DELETE FROM `hotel_photos`',
            'WHERE id=:id;'
        ].join(" ");

        return mysql.makeQuery(query, { id }, function (result) {
            return result.warningCount == 0;
        });
    }

    return {
        create: create,
        update: update,
        remove: remove,
        getList: getList,
        getListByOfferId: getListByOfferId,
        removeHotelsByOfferId: removeHotelsByOfferId,
        addHotelsToOfferId: addHotelsToOfferId,
        getById: getById,
        createTranslations: createTranslations,
        deleteHotelTranslations: deleteHotelTranslations,
        addPhotosToHotel: addPhotosToHotel,
        getPhotos: getPhotos,
        deletePhoto: deletePhoto
    };
}