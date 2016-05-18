'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const morgan = require('morgan');
const passport = require('passport');
const LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;
const Model = require('objection').Model;

const registerRoutes = require('./src/routes');
const coroutineRouteMethods = require('./src/utils/coroutineRouteMethods');
const errorHandler = require('./src/utils/errorHandler')
const logger = require("./src/utils/logger");

class App {
  constructor(config) {
    this.config = config;
    this.app = express();

    // Initialize logging
    logger.debug("Overriding 'Express' logger");
    this.app.use(morgan("combined", {"stream": logger.stream}));

    this.app.use(bodyParser.json());
    this.initAuthentication();
    this.server = null;
    this.knex = this.createKnex();
    this.initObjection();

    coroutineRouteMethods(this.app);

    // Set CORS
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    registerRoutes(this.app);

    // Error logging
    this.app.use(function (err, req, res, next) {
      logger.error(err);
      return next(err);
    });
    // Error handling
    this.app.use(errorHandler);
  }

  createKnex() {
    return knex(require('./knexfile')[this.config.profile]);
  }

  initObjection() {
    Model.knex(this.knex);
  }

  initAuthentication() {
    this.app.use(passport.initialize());

    passport.use(new LocalAPIKeyStrategy(
      function (apikey, done) {
        if (apikey === 'apikey') {
          return done(null, true);
        } else {
          console.log('Api key (Header "apikey", GET or POST -parameter) should be apikey.');
          return done(null, false);
        }
      }
    ));
    let apikeyAuthentication = passport.authenticate('localapikey', {session: false});

    this.app.all('*', apikeyAuthentication);
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.port, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = App;

