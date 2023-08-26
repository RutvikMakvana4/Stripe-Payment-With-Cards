import express from "express";
import asyncWrap from "express-async-wrapper";
import webController from "./webController";

const routes = express.Router();

routes.get('/our-policies', asyncWrap(webController.ourPolicies))

module.exports = routes;