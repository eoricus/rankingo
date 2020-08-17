const data = require("./data.js");

async function run() {
  await data.init()
  data.fill()
};

run()