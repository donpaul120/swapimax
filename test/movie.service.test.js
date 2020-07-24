require('dotenv').config();
const context = require('../Context');

let {getMovie, getMovieComments, getMovies, getMovieCharacters} = require('../services/MoviesService');
const SwapiApiService = require('../services/SwapiApiService');

//Mocks
const mockDb = require('mock-knex');
const {beforeAll, afterAll, describe} = require("@jest/globals");
const tracker = mockDb.getTracker();

beforeAll(() => {
    mockDb.mock(context.getDatabase());
    tracker.install();
});

afterAll(() => {
    mockDb.unmock(context.getDatabase());
    tracker.uninstall();
});

describe("Retrieve Movies", () => {
    const movies = require('./movies.test');
    beforeAll(() => {
        tracker.on('query', query => {
            if (query.sql === "select count(`id`) as `count` from `comments` where `movie_id` = ?") {
                return query.response([{count: 1}])
            }
        });

        SwapiApiService.fetchMovieById = jest.fn((id) => {
            return Promise.resolve(movies[0])
        });

        SwapiApiService.fetchMovies = jest.fn(() => {
            return Promise.resolve({results: movies})
        });
    });
    test('getMovie: should retrieve a single movie and transform to the desired format', () => {
        const id = "1";
        return expect(getMovie({id})).resolves.toMatchObject({
            code: 200,
            payload: {
                data: expect.objectContaining({
                    comments_count: 1
                })
            }
        });
    });

    test('getMovies: should retrieve a list of movies and transform to the desired format', () => {
        return expect(getMovies()).resolves.toMatchObject({
            "code": 200,
            payload: {
                data: expect.any(Array)
            }
        });
    });

});

describe("Retrieve Movie Comments", () => {
    const movie = {
        title: "Rush",
        opening_crawl: "",
        release_date: "2019-09-02"
    };

    const CommentService = require('../services/CommentsService');
    const originalMovieService = jest.requireActual('../services/MoviesService');

    beforeAll(() => {
        CommentService.getCommentsByMovieId = jest.fn((id) => {
            return Promise.resolve([{
                id: 1,
                comment: "Tell a story to the world",
                movie_id: id,
                ip_address: "192.168.8.19",
                created: "",
                edited: ""
            }]);
        });

        originalMovieService.getMovie = jest.fn().mockImplementation(({id}) => {
            if (id === 0) return Promise.reject({error: "The specified resource was not found", code: 404});
            movie.id = id;
            return Promise.resolve({
                code: 200,
                payload: {data: movie}
            });
        });
    });

    test("getMovieComments: should retrieve a list of movie comments successfully", () => {
        const id = 1;
        return expect(getMovieComments({id})).resolves.toMatchObject({
            code: 200,
            payload: {
                data: expect.arrayContaining([
                    expect.objectContaining({id: 1, comment: "Tell a story to the world"})
                ]),
                title: movie.title,
                total: 1
            }
        })
    });

    test("getMovieComments: should fail if the movie id doesn't exist", () => {
        const id = 0;
        return expect(getMovieComments({id})).rejects.toMatchObject({
            code: 404,
            error: "The specified resource was not found"
        })
    });

});


describe("Retrieve Movie Characters", () => {
    const people = require('./people.test');
    beforeAll(() => {
        SwapiApiService.fetchCharactersByMovieId = jest.fn((id) => {
            return Promise.resolve(people);
        })
    });

    test("getMovieCharacters: should retrieve a list of characters", () => {
        const id = 1;
        return expect(getMovieCharacters({id})).resolves.toMatchObject({
            code: 200,
            payload: {
                data: expect.any(Array)
            }
        });
    });

    test("getMovieCharacters: should sort characters using name in ascending order", () => {
        const id = 1;
        const sort = "name:asc";
        return expect(getMovieCharacters({id, sort})).resolves.toMatchObject({
            code: 200,
            payload: {
                data: [
                    expect.objectContaining({name: "C-3PO"}),
                    expect.objectContaining({name: "Luke Skywalker"}),
                    expect.objectContaining({name: "R2-D2"})
                ]
            }
        });
    });

    test("getMovieCharacters: should sort characters using height in ascending order", () => {
        const id = 1;
        const sort = "height:asc";
        return expect(getMovieCharacters({id, sort})).resolves.toMatchObject({
            code: 200,
            payload: {
                data: [
                    expect.objectContaining({height: "96"}),
                    expect.objectContaining({height: "167"}),
                    expect.objectContaining({height: "172"}),
                ]
            }
        });
    });

    test("getMovieCharacters: should filter characters by gender", () => {
        const id = 1;
        const sort = "height:asc";
        const gender = "male";
        return expect(getMovieCharacters({id, sort, gender})).resolves.toMatchObject({
            code: 200,
            payload: {
                data: [
                    expect.objectContaining({name: "Luke Skywalker"})
                ]
            }
        });
    });

    test("getMovieCharacters: should sum the height of all characters", () => {
        const id = 1;
        const sort = "height:asc";
        return expect(getMovieCharacters({id, sort})).resolves.toMatchObject({
            code: 200,
            payload: {
                data: expect.any(Array),
                total_height: {
                    cm: 435,
                    feet: 14,
                    inches: "171.26"
                },
                total: 3
            }
        });
    });

});
