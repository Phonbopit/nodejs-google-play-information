'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var URL = 'https://play.google.com/store/apps/details?id=';

app.get('/', function (req, res) {
    res.json({ message: 'OK' });
});

app.get('/:appId', function (req, res) {
    var appId = req.params.appId;
    var lang = req.query.lang || 'en';

    console.log(URL + appId);

    (0, _request2.default)(URL + appId + '&hl=' + lang, function (err, response, body) {
        if (!err && response.statusCode === 200) {

            var $ = _cheerio2.default.load(body);

            var title = $('.document-title').text().trim();
            var publisher = $('.document-subtitle.primary').text().trim();
            var category = $('.document-subtitle.category').text().trim();
            var score = $('.score-container > .score').text().trim();
            var version = $('.meta-info > .content').eq(3).text().trim();

            res.json({
                data: {
                    title: title,
                    publisher: publisher,
                    category: category,
                    score: score,
                    version: version
                }
            });
        } else {
            res.json({
                message: err
            });
        }
    });
});

app.listen(3000, function () {
    console.log('Application is running on port 3000');
});
