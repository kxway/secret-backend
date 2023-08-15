exports.up = function(knex) {
    return knex.schema.createTable("timeline", (table) => {
      table.increments("id").primary();
      table.integer("user_id").references("id").inTable("users").notNullable();
      table.text("post_content").notNullable();
      table.integer("likes").defaultTo(0);
      table.integer("dislikes").defaultTo(0);
      table.string('location').notNullable();
      table.integer("relevance_score").defaultTo(0);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("timeline");
  };