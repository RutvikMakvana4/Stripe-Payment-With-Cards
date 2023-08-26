import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { apiBaseUrl } from "./constants/configConstants";

const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yml'));
const routes = express.Router();

routes.use('/api/documentation', (req, res, next) => {
    swaggerDocument.servers = [
        {
            url: apiBaseUrl(),
            description: "API base url"
        }
    ]
    req.swaggerDoc = swaggerDocument
    next();
}, swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        persistAuthorization: true,
    },
}))

module.exports = routes;