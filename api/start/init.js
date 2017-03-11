/**
 * Created by titu on 10/17/16.
 */

const api = require('./api');

let initStart = (app) => {
    app.get('/status', api.status);
    app.post('/clean', api.clean);
    app.post('/check_valid', api.check_valid);
    app.get('/search', api.search);
};

module.exports = initStart;