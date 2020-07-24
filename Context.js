const KNEX = require('knex');
const knexConfig = require('./knexfile');

class Context {

    #database;

    constructor() {
        this.#database = KNEX(knexConfig['development']);
    }

    getDatabase() {
        return this.#database;
    }

}

module.exports = new Context();