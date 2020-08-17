const Sequelize = require("sequelize");

const express = require("express");

const args = require("yargs").argv;

const config = require("../../config.js");

const data = require("../data/data.js");

/**
 * @description Запускает сервер. В режиме разработчика только
 * api, в обычном — все целиком.
 * @param {boolean} dev Режим разработчика
 */
async function runServer(dev) {
  const app = express();
  const port = dev ? 3001 : 8080;
  await data.init();

  if (!dev) {
    app.use(express.static(config.path + "//dist"));

    app.get("/|", function (req, res) {
      res.sendFile(config.path + "//dist//index.html");
    });
  } else {
    console.log("Запущено в режиме разработчика");
  }

  app.get("/api", async function (req, res) {
    let result;
    switch (req.query.type) {
      case "top":
        result = await data.models.university.findAll({
          where: {},
          order: [
            ["verifiedGraduates", "DESC"],
            ["graduates", "DESC"],
          ],
          limit: 100,
          raw: true,
        });
        break;
      case "universitiesByTitle":
        result = await data.models.university.findAll({
          where: {
            titleForSearch: { [Sequelize.Op.like]: req.query.title + "%" },
          },
          order: [
            ["verifiedGraduates", "DESC"],
            ["graduates", "DESC"],
          ],
          raw: true,
        });
        break;
      case "universitiesByCityID":
        result = await data.models.university.findAll({
          where: {
            cityID: req.query.cityID,
          },
          order: [
            ["verifiedGraduates", "DESC"],
            ["graduates", "DESC"],
          ],
          raw: true,
        });
        break;
      case "cities":
        result = await data.models.city.findAll({ raw: true });
        break;
    }

    res.send(result);
  });

  app.listen(port, function () {
    console.log(`Сервер запущен на порте ${port}`);
  });
}

runServer(args.dev);
