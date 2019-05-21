const express = require('express');
const router = express.Router();
const jwtauth = require('../user/jwtAuth.js');
const multer = require('multer');
const appConfig = require('../../config/main.config');
const fileService = new (require('../../lib/FileService'))();

const storage = fileService.createStorage(multer, appConfig.UPLOADS_PATH_HOTEL);

const upload = multer({ storage: storage });
const hotelUpload = upload.fields([{ name: 'photos', maxCount: 20 }]);

module.exports = (Controller) => {
    router.get('/', jwtauth, Controller.getList);
    router.get('/:id', jwtauth, Controller.getById);
    router.post('/', jwtauth, hotelUpload, Controller.create);
    router.put('/:id', jwtauth, hotelUpload, Controller.update);
    router.delete('/:id', jwtauth, Controller.remove);
    router.delete('/photos/:id', jwtauth, Controller.deletePhoto);

    return router;
};
