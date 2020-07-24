
exports.up = function(knex) {
  return knex.schema
      .createTable('comments', function(table){
          table.increments('id');
          table.string('comment', 500);
          table.string('ip_address', 20).nullable();
          table.integer('movie_id');
          table.timestamp('created').notNullable().defaultTo(knex.fn.now());
          table.timestamp('edited').notNullable().defaultTo(knex.fn.now());
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('comments');
};
