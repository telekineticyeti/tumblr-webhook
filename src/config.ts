const path = require('path');

const port = process.env.port && !isNaN(parseInt(process.env.port)) ? parseInt(process.env.port) : 8080;

const downloadPath = path.join(__dirname, '..', 'downloads');

const config = {
  port,
  downloadPath,
  // https://api.tumblr.com/console/calls/user/info
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  token: process.env.token,
  token_secret: process.env.token_secret,
};

export default config;
