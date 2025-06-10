import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  admin_email: process.env.ADMIN_EMAIL,
  admin_pass: process.env.ADMIN_PASS,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  stripe_secret: process.env.STRIPE_SECRET,
  frontend_url: process.env.FRONTEND_URL,
  auth0_domain: process.env.AUTH0_DOMAIN,
  auth0_client_id: process.env.AUTH0_CLIENT_ID,
  auth0_audience: process.env.AUTH0_AUDIENCE,
  auth0_issuer: process.env.AUTH0_ISSUER,
};
