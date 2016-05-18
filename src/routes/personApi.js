'use strict';

const Person = require('../models/Person');

/**
 * Handles routes under /persons/
 * @param app
 */
module.exports = function (app) {

  // Create a new Person.
  app.post('/persons', function*(req, res) {
    const person = yield Person
      .query()
      .insert(req.body);

    res.send(person);
  });

  // Patch a Person.
  app.patch('/persons/:id', function*(req, res) {
    const person = yield Person
      .query()
      .patchAndFetchById(req.params.id, req.body);

    res.send(person);
  });

  // Get a Person.
  app.get('/persons/:id', function*(req, res) {
    const person = yield Person
      .query()
      .findById(req.params.id);

    res.send(person);
  });

  // Get all Persons.
  app.get('/persons', function*(req, res) {
    const persons = yield Person
      .query();

    res.send(persons);
  });

  // Delete a Person.
  app.delete('/persons/:id', function*(req, res) {
    yield Person
      .query()
      .deleteById(req.params.id);

    res.send({});
  });
};
