var qiniu = require("qiniu");
var Q = require("q");
var path = require("path");
var uuid = require("uuid");
var moment = require('moment');

var C = {
    qiniu: {
        access_key: 'NPGtMY48QJz8vu19E_8fSvl4g20tdmgEZuE5-N9X',
        secret_key: 'H1ASMSC27erE19ebNaH53PNDYVHDmnsqeafiYSR-',
        up_host: 'http://up-z1.qiniu.com',
        bucket: 'file',
        cdn_host: "http://cdn.xfoody.com"
    }
};

qiniu.conf.ACCESS_KEY = C.qiniu.access_key;
qiniu.conf.SECRET_KEY = C.qiniu.secret_key;
qiniu.conf.UP_HOST = C.qiniu.up_host;
var bucket = C.qiniu.bucket;

var uptoken = function (bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
};

var uploadFileDo = function (key, localFile) {
    var defer = Q.defer();
    var token = uptoken(bucket, key);

    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token, key, localFile, extra, function (err, ret) {
        if (!err) {
            var url = C.qiniu.cdn_host + "/" + ret.key;
            defer.resolve(url);
        } else {
            defer.reject(err);
        }
    });
    return defer.promise;
};


var uploadMedia = function (filePath) {
    var extname = path.extname(filePath).slice(1);
};

var uploadFile = function (filePath, options) {
    if (options.name) {
        var key = options.name;
    } else {
        var arr = filePath.split("/");
        var name = arr[arr.length - 1];
        var key = moment().format("YYYY-MM-DD") + "/" + uuid.v1() + "/" + name;
    }
    return uploadFileDo(key, filePath);
};

module.exports = function (filePath, options) {
    options = options || {};
    var tuchuang = ['jpg', 'png', 'gif', 'jpeg'];
    var extname = path.extname(filePath).slice(1);
    if (tuchuang.indexOf(extname) > -1) {
        return uploadFile(filePath, options);
    }
    return uploadFile(filePath, options);
};