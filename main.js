import express from 'express';
import cheerio from 'cheerio';
import request from 'request';

const app = express();
const URL = 'https://play.google.com/store/apps/details?id=';

app.get('/:appId', (req, res) => {
    let appId = req.params.appId;
    let lang = req.query.lang || 'en';

    console.log(URL + appId);

    request(URL + appId + '&hl=' + lang, (err, response, body) => {
        if (!err && response.statusCode === 200) {

            let $ = cheerio.load(body);

            let title = $('.document-title').text().trim();
            let publisher = $('.document-subtitle.primary').text().trim();
            let category = $('.document-subtitle.category').text().trim();
            let score = $('.score-container > .score').text().trim();
            let install = $('.meta-info > .content').eq(2).text().trim();
            let version = $('.meta-info > .content').eq(3).text().trim();

            res.json({
                data: {
                    title: title,
                    publisher: publisher,
                    category: category,
                    score: score,
                    install: install,
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

app.listen(3000, () => {console.log('Application is running on port 3000')});
