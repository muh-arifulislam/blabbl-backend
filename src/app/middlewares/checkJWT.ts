import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import config from '../config';

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.auth0_domain}/.well-known/jwks.json`,
  }),

  audience: config.auth0_audience,
  issuer: config.auth0_issuer,
  algorithms: ['RS256'],
});

export default checkJwt;
