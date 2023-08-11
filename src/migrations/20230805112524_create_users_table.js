exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('twitterId').unique();
      table.string('photo');
      table.string('current_location').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };