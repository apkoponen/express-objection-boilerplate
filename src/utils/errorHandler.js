'use strict';

const _ = require('lodash');

/**
 * Check if error is a PostgresError.
 *
 * @param error
 * @returns {boolean}
 */
function isPostgresError(error) {
  if (!error) {
    return false;
  }
  // Just check the existence of a bunch of attributes. There doesn't seem to be an easier way.
  return _.all(['severity', 'code', 'detail', 'internalQuery', 'routine'], function (attr) {
    return _.has(error, attr);
  });
}

/**
 * Middleware for Express.
 *
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns next(), if no error.
 */
function middleware(err, req, res, next) {
  if (!err) {
    return next();
  }

  let errorMessage = err.data || err.message || {};

  // Override message for SQL-errors
  if (err.code === 'SQLITE_ERROR' || isPostgresError(err)) {
    errorMessage = "Database error.";
  }

  res.status(err.statusCode || err.status || 500).send(errorMessage);
}


module.exports = middleware;