require('dotenv').config();
const context = require('../Context');
const CommentService = require('../services/CommentsService');


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


describe("Add Comments", () => {

    beforeAll(() => {
        tracker.on('query', query => {
            if (query.sql === "insert into `comments` (`comment`, `ip_address`, `movie_id`) values (?, DEFAULT, ?)") {
                return query.response([2])
            }
        })
    });

    test('addComment: should add comments successfully', () => {
        const comment = {
            comment: "Any Any",
            movie_id: 1
        };
        return expect(CommentService.addComment({comment})).resolves.toMatchObject({
            code: 200,
            payload: {
                data: expect.objectContaining({
                    id: 2,
                    comment: "Any Any"
                })
            }
        });
    });
});