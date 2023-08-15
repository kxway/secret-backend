exports.up = function(knex) {
    return knex.schema.createTable('post_comments', (table) => {
      table.increments('id').primary();
      table.integer('post_id').unsigned().references('id').inTable('timeline').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      table.text('content').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('comments');
  };