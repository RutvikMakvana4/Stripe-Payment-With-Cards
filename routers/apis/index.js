import express from "express";
const routes = express.Router();
import authentication from "../../src/common/middleware/authentication";

routes.use('/auth', require('../../src/apis/auth/authRouter'));

// Stripe payment
routes.use('/stripe', authentication, require('../../src/apis/stripe/stripeRouter'));

module.exports = routes;