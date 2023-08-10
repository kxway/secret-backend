// migration: create_refresh_tokens.js
exports.up = function(knex) {
    return knex.schema.createTable('refresh_tokens', (table) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users');
      table.string('token').notNullable();
      table.timestamp('expires_at').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('refresh_tokens');
  };