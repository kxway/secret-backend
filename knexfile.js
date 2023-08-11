module.exports = {
    development: {
      client: 'sqlite3',
      connection: {
        filename: './dev.sqlite3'
      },
      useNullAsDefault: true,
      migrations: {
        directory: './src/migrations'
      },
      seeds: {
        directory: './src/seeds'
      },
    }
  };