'use strict';

const Hapi = require('hapi');
const request = require('request');
const cheerio = require('cheerio');

const URL = 'https://play.google.com/store/apps/details?id=';

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8088
});

server.route({
  method: 'GET',
  path: '/{appId}',
  handler: (req, reply) => {

    let appId = req.params.appId;
    let lang = req.query.lang || 'en';
    let url = `${URL}${appId}&hl=${lang}`;

    request(url, (err, response, body) => {

      if (!err && response.statusCode === 200) {

        let $ = cheerio.load(body);

        let title = $('.document-title').text().trim();
        let publisher = $('.document-subtitle.primary').text().trim();
        let category = $('.document-subtitle.category').text().trim();
        let score = $('.score-container > .score').text().trim();
        let install = $('.meta-info > .content').eq(2).text().trim();
        let version = $('.meta-info > .content').eq(3).text().trim();

        reply({
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
        reply({
          message: `We're sorry, the requested ${url} was not found on this server.`
        });
      }
    });

  }
});

server.start(err => {
  console.log(`Server running at ${server.info.uri}`);
});