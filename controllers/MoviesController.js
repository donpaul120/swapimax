/**
 * The MoviesController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/MoviesService');
const getMovie = async (request, response) => {
  await Controller.handleRequest(request, response, service.getMovie);
};

const getMovieCharacters = async (request, response) => {
  await Controller.handleRequest(request, response, service.getMovieCharacters);
};

const getMovieComments = async (request, response) => {
  await Controller.handleRequest(request, response, service.getMovieComments);
};

const getMovies = async (request, response) => {
  await Controller.handleRequest(request, response, service.getMovies);
};


module.exports = {
  getMovie,
  getMovieCharacters,
  getMovieComments,
  getMovies,
};
