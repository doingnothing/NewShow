var mongoose = require('mongoose');
var config = require('../config');

var Schema = mongoose.Schema;

var photoSchema = new Schema({
    name: String,
    filename: String,
    size: String,
    type: String,
    date: {type: Date, default: Date.now}
});

var Photo = mongoose.model('Photo', photoSchema);

exports.addOne = function (data, callback) {
    new Photo({
        name: data.name,
        filename: data.filename,
        size: data.size,
        type: data.type
    }).save(callback);
};

exports.like = function (id, callback) {
    Photo.findOneAndUpdate({
        _id: id
    }, {
        $inc: { likes: 1 }
    }, callback);
};

exports.getPhotos = function (page, callback) {
    Photo.find({})
        .sort('-date')
        .skip((page - 1) * config.photo_list_limit)
        .limit(config.photo_list_limit)
        .select('_id name filename')
        .exec(callback);
};

exports.getPhoto = function (id, callback) {
    Photo.findOne({_id: id})
        .select('_id name filename size type')
        .exec(callback);
};