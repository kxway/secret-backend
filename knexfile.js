const prodDbConnection = process.env.DATABASE_URL;

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/migrations",
    },
    seeds: {
      directory: "./src/seeds",
    },
  },
  production: {
    client: "pg",
    connection: prodDbConnection,
    migrations: {
      directory: "./src/migrations",
    },
    seeds: {
      directory: "./src/seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
