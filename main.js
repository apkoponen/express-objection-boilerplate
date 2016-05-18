'use strict'

let env = 'production';
if (process.argv.indexOf('--development') !== -1) {
  env = 'development';
}
const config = require('./config/' + env);
const App = require('./App');

const app = new App(config);

app.start().then(() => {
  console.log(`app running at port ${config.port}`);
}).catch(err => {
  console.log(err.stack);
})