var path = require('path');

var express = require('express');
var multer = require('multer');
var mongoose = require('mongoose');

var config = require('./config');
var models = require('./models');
var isObjectId = function (_id) {
    var ObjectId = mongoose.Types.ObjectId;
    return (new ObjectId(_id) == _id);
};
var apiRouter = express.Router();

var upload = multer({
    dest: config.uploadDir
});
var single = function (req, res, next) {
    upload.single('photo')(req, res, function (err) {
        if (err) {
            return next(err);
        }
        next();
    });
};
var verifyId = function (req, res, next) {
    var _id = (req.params && req.params.id);
    if (!isObjectId(_id)) {
        return error(res, '_id=' + _id + '不是ObjectId类型');
    }
    next();
};

var im = require('imagemagick');
var Photo = models.Photo;
apiRouter.post('/upload', single, function (req, res, next) {
    var file = req.file;
    var body = req.body;

    Photo.addOne({
        name: body.name,
        size: body.size,
        type: body.type,
        filename: file.filename
    }, function (err, o) {
        if (err) {
            return next(err);
        }
        res.send({
            success: true,
            data: {
                _id: o._id
            }
        })
    });

    im.resize({
        srcPath: './public/upload/' + file.filename,
        dstPath: './public/upload/thumbnail/' + file.filename,
        width:   200,
        format: 'jpg'
    }, function (err) {
        if (err) {
            console.log(err);
        }

    });
});
apiRouter.get('/photos', function (req, res, next) {
    var query = req.query;
    Photo.getPhotos(query && query.page || 1, function (err, os) {
        if (err) {
            return next(err);
        }
        res.send({
            success: true,
            data: os
        })
    })
});
apiRouter.get('/photo/:id', verifyId, function (req, res, next) {
    var params = req.params;

    Photo.getPhoto(params.id, function (err, o) {
        if (err) {
            return next(err);
        }
        res.send({
            success: true,
            data: o
        });
    })
});

module.exports = apiRouter;