var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
	var multiparty = require('multiparty');
    var fs = require('fs');
    var form = new multiparty.Form();
    form.uploadDir = '/tmp';
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.autoFiles = false;

    form.on('file', function (name, file) {
    });

    form.on('aborted', function () {
    });

    form.on('error', function (err) {
        return next(err);
    });

    form.parse(req, function (err, fields, files) {
        if (err)
            return next(new Error("Error in parse fields !!!"));
        var check = checkPrarameters(fields, files);
        if (check.hasOwnProperty('message')) {
            res.status(500);
            res.json(check.message);
            return;
        }
        if (Object.getOwnPropertyNames(files).length === 0) {
            res.status(500);
            res.json('Duplicated?');
            return;
        }
        fs.rename(files.file[0].path, '/tmp/' + new Date().getTime(), function (err) {
        	if (err)
                console.log(err);
            res.status(500);
            res.json(err);
            return
        });
        res.json('Okay');
    });          
});

function checkPrarameters(fields, files) {
    if (typeof files === "undefined" ||
            typeof fields === "undefined") {
        return {message: 'One of the param was missed !'};
    }
    if (!fields.hasOwnProperty('password')) {
        return {message: 'password!!!'};
    }
    if (fields["password"][0].length === 0) {
        return {message: 'password!!!'};
    }
    return {};
}

module.exports = router;


