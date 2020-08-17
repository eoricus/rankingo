const fs = require("fs");

const { VK } = require("vk-io");

const config = require("../../config.js");

const progress = require("../../progress.json");

const Sequelize = require("sequelize");

/**
 * @description Класс для упрощенной работы с базой данных
 */
class Data {
  constructor() {
    this.sequelize = new Sequelize("Rankingo", "admin", "admin", {
      dialect: "sqlite",
      host: "localhost",
      storage: "./data.sqlite",
      define: {
        timestamps: false,
      },
      logging: false,
    });

    this.models = {
      university: this.sequelize.define("university", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        cityID: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        titleForSearch: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        graduates: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        verifiedGraduates: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      }),
      city: this.sequelize.define("city", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        titleForSearch: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      }),
    };
  }
  
  /**
   * @description Синхронизация sequelize-а
   */
  async init() {
    console.log("База данных успешно запущена");
    return await this.sequelize.sync();
  }

  /**
   * @description Полуение данных из ВК.
    1. Сначала получаем progress.json с данными о прогрессе выполнения.
    2. Если города не записаны, то сначала получаем главные города России.
    3. После, начинаем поиск университетов в каждом из этих городов, 
    с того места, которое указано в progress.json.
    4. Для каждого университета получаем число верифицированных выпускников,
    так как ВК не дает сортировать пользователей по этому признаку, то
    просто перебором смотрим всех выпускников, и если 20 подряд нет
    верифицированных, то прекращаем перебор.
    5. Из-за ограничения на частоту запросов, при получении 0 выпускников, 
    нынешные данные записываются в progress.json, и при следующем запуске
    начинаем работу с этого места.
   */
  async get() {
    let vk = new VK({
      token:
        config.vk.tokens[Math.floor(Math.random() * config.vk.tokens.length)],
    });

    // Если города еще не записаны
    if (!progress.citiesWritten) {
      let cities = await vk.api.database.getCities({
        country_id: 1,
        count: 100,
      });

      cities.items.forEach((element) => {
        // Добавление в базу данных всех городов
        this.models.city
          .create({
            id: element.id,
            title: element.title,
            titleForSearch: element.title.toLowerCase(),
          })
          .catch((err) => console.log(err));
      });

      console.log("Города успешно записаны в базу данных");
    }

    // Заполнение университетов
    let cities = await this.models.city.findAll({ raw: true });
    let u = progress.universityIndex;
    let c = progress.cityIndex;
    let universities = progress.universities;

    for (c; c < cities.length; c++) {
      // Если нет загруженных университетов
      if (universities.length == 0 || !(u < universities.length)) {
        let response = await vk.api.database.getUniversities({
          country_id: 1,
          city_id: cities[c].id,
          count: 10000,
        });
        universities = response.items;
        u = 0;
        console.log(cities[c].title);
      }

      // Перебор университетов
      for (u; u < universities.length; u++) {
        let graduates = await vk.api.users.search({
          count: 1000,
          university: universities[u].id,
          fields: "verified",
        });

        // Если есть результат
        if (graduates.count) {
          // Перебор выпускников
          for (
            var i = 0, o = 0, v = 0;
            i + 1 < graduates.count && o < 20;
            i++
          ) {
            // Верифицированные пользователи
            v += graduates.items[i].verified;
            // Cмещение
            o += !graduates.items[i].verified;
          }

          this.models.university
            .create({
              id: universities[u].id,
              cityID: cities[c].id,
              title: universities[u].title,
              titleForSearch: universities[u].title.toLowerCase(),
              graduates: graduates.count,
              verifiedGraduates: v,
            })
            .then((res) =>
              console.log(
                res.dataValues.title,
                res.dataValues.graduates,
                res.dataValues.verifiedGraduates,
                res.dataValues.cityID
              )
            )
            .catch((err) => console.log(err));
        }
        // Если результата нет
        if (!graduates.count || !(u < universities.length)) {
          let json = JSON.stringify({
            cityIndex: c,
            universityIndex: u,
            citiesWritten: true,
            universities: universities,
          });

          fs.writeFile("./progress.json", json, "utf8", (res) => {
            console.log(res);
          });

          console.log("Выполнение остановлено, прогресс сохранен");
          return;
        }
      }
    }
  }

  /**
   * @description Заполнение базы данных из json-ов
   */
  fill() {
    try {
      fs.statSync(__dirname + "/json");

      const cities = require("./json/cities.json");
      cities.forEach((element) => {
        element.titleForSearch = element.title.toLowerCase();
        this.models.city
          .create(element)
          .then()
          .catch((err) => console.log(err));
      });

      const universities = require("./json/universities.json");
      universities.forEach((element) => {
        element.titleForSearch = element.title.toLowerCase();
        this.models.university
          .create(element)
          .then()
          .catch((err) => console.log(err));
      });
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("file or directory does not exist");
      }
    }
  }
}

module.exports = new Data();
