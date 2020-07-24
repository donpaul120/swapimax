/* eslint-disable no-unused-vars */
const Service = require('./Service');
const CommentService = require('./CommentsService');
const SwapiApiService = require('./SwapiApiService');
const {querySort} = require('../utils/Utils');

/**
 * Fetches a single movie
 *
 * @param  id Integer ID of the particular movie to retrieve
 * @returns MovieResponse
 * */
const getMovie = ({id}) => new Promise(async (resolve, reject) => {
    try {
        const result = await SwapiApiService.fetchMovieById(id);
        const movie = await transformMovie(result);
        return resolve(Service.successResponse(movie));
    } catch (e) {
        return reject(Service.handleClientError(e));
    }
});

/**
 * Fetches all characters for a particular movie
 *
 * @param id Integer Unique ID of a movie
 * @param sort String Sort (optional)
 * @param gender String filter by gender (optional)
 * @returns MovieCharactersResponse
 * */
const getMovieCharacters = ({id, sort, gender}) => new Promise(async (resolve, reject) => {
    try {
        const sortColumns = ['name', 'height'];
        let characters = await SwapiApiService.fetchCharactersByMovieId(id);
        if (sort) {
            characters = querySort(sort, characters, sortColumns);
        }
        if (gender) {
            characters = characters.filter((a) => a['gender'].toLowerCase() === gender);
        }
        const cm = characters.reduce((a, c) => a + ((isNaN(c['height'])) ? 0 : parseInt(c['height'])), 0);

        const totalHeight = {cm, feet: Math.floor(cm / 30.48), inches: (cm / 2.54).toFixed(2)};

        const response = Service.successResponse(characters, characters.length);

        response.payload['total_height'] = totalHeight;
        return resolve(response);
    } catch (e) {
        return reject(Service.handleClientError(e));
    }
});

/**
 *
 * @param id Integer Unique ID of a movie
 * @returns MovieCommentsResponse
 * */
const getMovieComments = ({id}) => new Promise(async (resolve, reject) => {
    try {
        const {payload: {data: movie}} = await module.exports.getMovie({id});
        const comments = await CommentService.getCommentsByMovieId(movie.id);
        const response = Service.successResponse(comments, comments.length);
        response.payload.title = movie.title;
        return resolve(response)
    } catch (e) {
        return reject(Service.handleClientError(e));
    }
});

/**
 * Fetches all star war movies
 *
 * @returns MoviesResponse
 * */
const getMovies = () => new Promise(async (resolve, reject) => {
    try {
        const {results} = await SwapiApiService.fetchMovies();
        const movies = [];
        for (let result of results) {
            const movie = await transformMovie(result);
            movies.push(movie);
        }
        const sortedMovies = movies.sort((a, b) => {
            return Date.parse(a['release_date']) - Date.parse(b['release_date'])
        });

        return resolve(Service.successResponse(sortedMovies));
    } catch (e) {
        return reject(Service.handleClientError(e));
    }
});

const transformMovie = async (movie) => {
    const url = movie['url'];
    const {characters, planets, species, starships, vehicles, ...mMovie} = movie;
    mMovie['id'] = parseInt(url.substring(url.indexOf('films/') + 6, url.length - 1));
    mMovie['comments_count'] = await CommentService.getCommentsCountByMovieId(mMovie.id);
    return mMovie;
};

module.exports = {
    getMovie,
    getMovieCharacters,
    getMovieComments,
    getMovies,
};
