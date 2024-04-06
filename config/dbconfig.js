
export default {
    development: {
      username: 'michaelmcdermott',
      password: null,
      database: 'VetMyIdea',
      host: '127.0.0.1',
      port: 5432,
      dialect: 'postgresql',
    },
    test: {
      username: 'michaelmcdermott',
      password: null,
      database: 'VetMyIdea',
      host: '127.0.0.1',
      port: 5432,
      dialect: 'postgresql',
    },
    production: {
        username: 'dbadmin',
        password: process.env.NUXT_DB_PASSWORD,
        database: 'VetMyIdea',
        host: process.env.NUXT_DB_HOST,
        port: 5432,
        dialect: 'postgresql',
        logging: false
    }
  };