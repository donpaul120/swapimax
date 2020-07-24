// Update with your config settings.
const moment = require('moment');
require('dotenv').config();

module.exports = {

    test: {
        client: 'mysql2',
        debug: false,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: "./database/migrations",
            tableName: 'migrations'
        }
    },

    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT,
            typeCast: function (field, next) {
                if (['TIMESTAMP', 'DATETIME', 'DATE'].includes(field.type)) {
                    const value = field.string();
                    return (value === null)
                        ? value
                        : moment(value).utc().utcOffset(parseInt(process.env.TIME_ZONE)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                }
                return next();
            }
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: "./database/migrations",
            tableName: 'migrations'
        },
        seeds: {
            directory: "./database/seeds"
        }
    }
};
