'use strict';

const expect = require('chai').expect;
const request = require('supertest');

const Person = require('../../src/models/Person');

const config = require('../../config/test');
const App = require('../../App');
const app = new App(config);
const api = request(app.app);

const AUTHORIZATION = {
  apikey: 'apikey' // Remember to load from env in production
}

describe('person API', function () {
  before(function () {
    // Start-up app with test config and load DB schema
    return app.start().then(function () {
      return app.knex.migrate.latest();
    });
  });

  beforeEach(function () {
    return Person.query().truncate();
  });


  it('should add a Person', function (done) {
    let personToAdd = {
      id: 20,
      firstName: "Jennifer",
      lastName: "Lawrence",
      age: 24
    };

    api
      .post('/persons')
      .send(personToAdd)
      .set(AUTHORIZATION)
      .expect(200, personToAdd)
      .end(function (err, res) {

        Person
          .query()
          .findById(personToAdd.id)
          .then(function (person) {
            expect(parseInt(person.id)).to.equal(personToAdd.id);
            expect(person.firstName).to.equal(personToAdd.firstName);
            expect(person.lastName).to.equal(personToAdd.lastName);
            expect(person.age).to.equal(personToAdd.age);

            done();
          });
      });
  });

  describe('with existing data', function () {
    let persons = [
      {
        id: 1,
        firstName: "Jennifer",
        lastName: "Lawrence",
        age: 24
      },
      {
        id: 2,
        firstName: "Bradley",
        lastName: "Cooper",
        age: 40
      },
      {
        id: 3,
        firstName: "Sylvester",
        lastName: "Stallone",
        age: 68
      }
    ];

    beforeEach(function () {
      return Person.query().insertWithRelated(persons);
    });

    it('should patch a Person', function (done) {
      let personToPatch = persons[0];

      // Define patch
      let patch = {lastName: 'Aniston'};

      // Send patch request
      api
        .patch('/persons/' + personToPatch.id)
        .send(patch)
        .set(AUTHORIZATION)
        .expect(200)
        .end(function (err, res) {
          expect(err).to.not.exist;

          // Get person from DB
          Person
            .query()
            .findById(personToPatch.id)
            .then(function (person) {

              // Check that city has been patched.
              expect(person.lastName).to.equal(patch.lastName);

              done();
            });
        });
    });

    it('should get a Person', function (done) {
      let personToGet = persons[0];

      api
        .get('/persons/' + personToGet.id)
        .set(AUTHORIZATION)
        .expect(200)
        .end(function(err, res) {
          let person = res.body;
          
          expect(parseInt(person.id)).to.equal(personToGet.id);
          expect(person.firstName).to.equal(personToGet.firstName);
          expect(person.lastName).to.equal(personToGet.lastName);
          expect(person.age).to.equal(personToGet.age);

          done();
        });
    });

    it('should get all Persons', function (done) {
      api
        .get('/persons')
        .set(AUTHORIZATION)
        .end(function (err, res) {
          expect(err).to.not.exist;

          expect(res.body.length === 3);

          done();
        });
    });
  });

  after(function () {
    return app.knex.migrate.rollback().then(function () {
      return app.server.close();
    });
  });

});