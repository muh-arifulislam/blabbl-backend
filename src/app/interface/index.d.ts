import { expressjwt } from 'express-jwt';

export interface Auth0DecodedToken extends expressjwt.JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  iss: string;
  aud: string | string[];
}

declare global {
  namespace Express {
    interface Request {
      auth: Auth0DecodedToken;
    }
  }
}
