# Express Objection.js boilerplate

A simple boilerplate for using Objection.js with Express. Test

## Installation

`git clone` this repository.

## Configuration

The app expects to find a PostgreSQL URL from the env variable DATABASE_URL (Format: postgresql://user[:password]@host/db). 
You can setup your preferred DB configuration in knexfile.js (cf. http://knexjs.org/#Installation-client). I recommend
using the same db for development and testing, because e.g. SQLite does not support all features that PostgreSQL 
supports with Objection.js.

## Usage

```sh
# Install depencies
npm install
# Install knex globally
npm install -g knex
# Setup DB schema
knex migrate:latest --env=development
# Seed the DB with a little bit of test data
knex seed:run --env=development
# Seed the DB with a little bit of test data
knex seed:run --env=development
# Start the development server
node main.js --development
```

Omit --env=development and --development if you're running the production version.

## Tests

All tests are run using `npm test`. Tests expect a table DATABASE_URL + 'test' to exit. You can override this in the 
knexfile.

Code coverage is reported using Istanbul. 

## Authentication

The boilerplate has simple apikey authentication. Just pass string "apikey" in the "apikey" header or as a GET- or
POST-parameter. You can change the apikey authentication from App.js.

## Logging

Winston is used to provide simple persistent logging.

