import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL,
  auth0_domain: process.env.AUTH0_DOMAIN,
  auth0_client_id: process.env.AUTH0_CLIENT_ID,
  auth0_audience: process.env.AUTH0_AUDIENCE,
  auth0_issuer: process.env.AUTH0_ISSUER,
};
