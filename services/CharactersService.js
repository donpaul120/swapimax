/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Fetches a single character
*
* id Integer ID of the particular character to retrieve
* returns CharacterResponse
* */
const getCharacter = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  getCharacter,
};
