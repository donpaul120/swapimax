/* eslint-disable no-unused-vars */
const Service = require('./Service');
const context = require('../Context');

const tableName = "comments";

/**
 * Add new comment to a movie
 *
 * comment Comment  (optional)
 * returns CommentResponse
 * */
const addComment = ({comment, ip_address}) => new Promise(async (resolve, reject) => {
    try {
        const db = context.getDatabase();
        const {id, created, edited, ...nComment} = comment;
        //TODO check if the movie exist

        nComment['ip_address'] = ip_address;
        const insert = await db.table(tableName).insert(nComment);
        nComment.id = insert.shift();
        return resolve(Service.successResponse(nComment))
    } catch (e) {
        console.log(e);
        return reject(Service.handleClientError(e))
    }
});

const getCommentsByMovieId = async (movie_id) => {
    const db = context.getDatabase();
    const whereClause = {movie_id};
    return db.table(tableName).select(['*']).where(whereClause).orderBy('created', 'desc');
};

const getCommentsCountByMovieId = async (movie_id) => {
    const db = context.getDatabase();
    const whereClause = {movie_id};
    const commentCount = await db.table(tableName).count(`id as count`).where(whereClause).catch(() => {
        console.error("Couldn't get the comments count");
    });
    return (commentCount) ? commentCount.shift().count : 0
};

module.exports = {
    addComment,
    getCommentsCountByMovieId,
    getCommentsByMovieId
};
