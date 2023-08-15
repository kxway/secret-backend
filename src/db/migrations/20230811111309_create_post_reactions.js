exports.up = function(knex) {
    return knex.schema.createTable('post_reactions', function(table) {
      table.increments('id').primary();
      table.integer('post_id').unsigned().notNullable();
      table.foreign('post_id').references('id').inTable('timeline');
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users');
      table.enu('type', ['like', 'dislike']).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('post_reactions');
  };