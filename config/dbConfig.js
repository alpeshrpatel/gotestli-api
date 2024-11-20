
const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB
};