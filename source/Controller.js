/*var config = require('../../../config/config');
var jwt = require('jwt-simple');*/
const async = require('async');
const Utils = require('../../lib/utils');
const FileService = new (require('../../lib/FileService'))();
const appConfig = require('../../config/main.config');

module.exports = function HotelController(HotelRepository) {

    async function create(req, res) {
        try {

            const hotelData = JSON.parse(req.body.hotel);

            let hotelId = await HotelRepository.create(hotelData);
            if (!hotelId) {
                catchError(res, "Failed to add hotel data");
                return;
            }
            // When create Hotel translation.hotelId is NULL
            hotelData.translations.forEach(translation => {
                translation.hotelId = hotelId;
            });
            const parallel = {
                translations: Utils.asyncFromPromise(HotelRepository.createTranslations(hotelData.translations)),
            };

            /*let successCreateTranslations = await HotelRepository.createTranslations(hotelData.translations);

            if (!successCreateTranslations) {
                catchError(res, "Failed to add hotel data");
                return;
            }*/
            const photos = req.files['photos'] ? req.files['photos'].map(f => f.filename) : [];


            if (photos.length > 0) {
                parallel.photos = Utils.asyncFromPromise(HotelRepository.addPhotosToHotel(hotelId, photos));
            }

            async.parallel(parallel, async function (err, results) {
                if (err) {
                    catchError(res, err, '---addHotelPhotosAndTranslations---')
                }

                const hotel = await HotelRepository.getById(hotelId);

                res.json({
                    success: !!hotel,
                    hotel: hotel.shift()
                });
            });

        } catch (err) {
            catchError(res, err);
        }
    }

    async function update(req, res) {
        try {

            const hotelData = JSON.parse(req.body.hotel);

            /*const success = await HotelRepository.update(hotelData);
            if (!success) {
                catchError(res, "Failed to update hotel data");
                return;
            }*/
            let successRemoveTranslations = await HotelRepository.deleteHotelTranslations(hotelData.id);
            // let successCreateTranslations = await HotelRepository.createTranslations(hotelData.translations);

            const photos = req.files['photos'] ? req.files['photos'].map(f => f.filename) : [];
            const parallel = {
                updateHotel: Utils.asyncFromPromise(HotelRepository.update(hotelData)),
                translations: Utils.asyncFromPromise(HotelRepository.createTranslations(hotelData.translations)),
            };

            if (photos.length > 0) {
                parallel.photos = Utils.asyncFromPromise(HotelRepository.addPhotosToHotel(hotelData.id, photos));
            }

            async.parallel(parallel, async function (err, updResults) {
                if (err) {
                    console.log('eerr', err);
                    catchError(res, err, '---Failed to update hotel data---')
                }

                const hotel = await HotelRepository.getById(hotelData.id);

                res.json({
                    success: !!hotel,
                    hotel: hotel.shift()
                });
            });
            /*if (!successCreateTranslations) {
                catchError(res, "Failed to update hotel data");
                return;
            }*/

        } catch (err) {
            catchError(res, err);
        }
    }
    async function getList(req, res) {
        try {
            let results = await HotelRepository.getList();
            if (!results) {
                catchError(res, "Hotel not found");
                return;
            }
            // let photos = HotelRepository.getPhotos('hotel', hotel.id);
            // hotel['photos'] = photos;
            res.json({
                hotels: results
            });
        } catch (err) {
            catchError(res, err);
        }
    }
    async function getById(req, res) {
        try {
            const hotelId = req.params.id;
            let results = await HotelRepository.getById(hotelId);
            if (!results) {
                catchError(res, "Hotel not found");
                return;
            }
            let hotel = results.shift();
            let photos = await HotelRepository.getPhotos(hotelId);
            hotel['photos'] = FileService.formatPhotos(req, photos, appConfig.PUBLIC_PATH_HOTEL);

            res.json({
                hotel: hotel
            });
        } catch (err) {
            catchError(res, err);
        }
    }

    async function remove(req, res) {
        try {
            let successRemoveTranslations = await HotelRepository.deleteHotelTranslations(req.params.id);
            let success = await HotelRepository.remove(req.params.id);

            if (!success) {
                catchError(res, "Hotel not found");
                return;
            }

            // let photos = HotelRepository.getPhotos('hotel', hotel.id);
            // hotel['photos'] = photos;
            res.json({
                success: success
            });
        } catch (err) {
            catchError(res, err);
        }
    }

    function deletePhoto(req, res) {
        HotelRepository.deletePhoto(req.params.id).then(success => {
            res.json({ success: success });
        }).catch(function (err) {
            catchError(res, err, '---deleteOfferPhoto---')
        });
    }

    return {
        getList: getList,
        getById: getById,
        create: create,
        update: update,
        remove: remove,
        deletePhoto: deletePhoto
    };
};