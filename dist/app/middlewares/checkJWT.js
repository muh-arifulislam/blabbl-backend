"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const config_1 = __importDefault(require("../config"));
const checkJwt = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${config_1.default.auth0_domain}/.well-known/jwks.json`,
    }),
    audience: config_1.default.auth0_audience,
    issuer: config_1.default.auth0_issuer,
    algorithms: ['RS256'],
});
exports.default = checkJwt;
