import express from "express";

const routes = express.Router();

routes.use('/api/v1', require('./apis/index'));

// our policies web view
routes.use('/', require('./web/webRouter'));

module.exports = routes;