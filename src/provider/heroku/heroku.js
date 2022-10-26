import Heroku from "heroku-client";
import config from "../../config.js";

let heroku;
if (!heroku) {
  heroku = new Heroku({ token: config.provider.heroku.apiToken });
}

export default heroku;
