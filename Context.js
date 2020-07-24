const KNEX = require('knex');
const knexConfig = require('./knexfile');

class Context {

    #database;
    static #SWAPI_BASE_URL = "https://swapi.dev/api";

    constructor() {
        this.#database = KNEX(knexConfig['development']);
    }

    getSwapiBaseUrl(){
        return Context.#SWAPI_BASE_URL;
    }

    getDatabase() {
        return this.#database;
    }

}

module.exports = new Context();