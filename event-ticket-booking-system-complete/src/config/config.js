require('dotenv').config();

function buildUrlFromEnv(prefix = '') {
  const host = process.env[`${prefix}DB_HOST`] || process.env.DB_HOST;
  const port = process.env[`${prefix}DB_PORT`] || process.env.DB_PORT;
  const user = process.env[`${prefix}DB_USER`] || process.env.DB_USER;
  const pass = process.env[`${prefix}DB_PASSWORD`] || process.env.DB_PASSWORD;
  const name = process.env[`${prefix}DB_NAME`] || process.env.DB_NAME;
  if (host && name) return `postgres://${user}:${pass}@${host}:${port}/${name}`;
  return undefined;
}

const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  development: {
    url: process.env.DATABASE_URL || buildUrlFromEnv(),
    dialect: 'postgres',
    logging: false
  },
  test: isTest
    ? {
        // use sqlite in-memory for fast, isolated tests
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
      }
    : {
        // allow a separate test URL or fall back to DATABASE_URL
        url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL || buildUrlFromEnv(),
        dialect: 'postgres',
        logging: false
      },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  }
};
