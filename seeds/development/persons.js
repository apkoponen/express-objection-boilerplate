exports.seed = function (knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('Person').del(),

    // Inserts seed entries
    knex('Person').insert({
      firstName: "Jennifer",
      lastName: "Lawrence",
      age: 24
    }),
    knex('Person').insert({
      firstName: "Bradley",
      lastName: "Cooper",
      age: 40
    }),
    knex('Person').insert({
      firstName: "Sylvester",
      lastName: "Stallone",
      age: 68
    })
  );
};
