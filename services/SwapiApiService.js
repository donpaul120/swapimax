const client = require('superagent');


class SwapiApiService {

    static #BASE_URL = "https://swapi.dev/api";

    static async fetchMovies() {
        const {body} = await client.get(`${this.#BASE_URL}/films/`);
        return body;
    }

    static async  fetchMovieById(id) {
        const {body} = await client.get(`${this.#BASE_URL}/films/${id}`);
        return body;
    }

    static async fetchCharactersByMovieId(id) {
        const {body: {characters: urls}} = await client.get(`${this.#BASE_URL}/films/${id}`);
        const characters = [];
        for (let url of urls) {
            const {body: character} = await client.get(url);
            const link = character['url'];
            character.id = parseInt(url.substring(link.indexOf('people/') + 7, link.length - 1));
            characters.push(character);
        }
        return characters;
    }

}

module.exports = SwapiApiService;