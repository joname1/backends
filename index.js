const express = require("express");
const request = require("superagent");
const axios = require("axios");
const utils = require("./utils");

const app = express();

const HostAPI = "https://ncov.html5.qq.com";
const JHUAPI =
  "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services";
const TechAPI = "https://mainssl.geekpark.net";
const TimeAPI = "http://h5.oeeee.com";

app.all("*", (req, res, next) => {
  if (!req.get("Origin")) return next();
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  if (req.method === "OPTIONS") return res.send(200);
  next();
});

//tech数据
app.get("/api/v1", (req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl);
  sreq.pipe(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sreq.on("end", () => {
    console.log("v1: ok");
  });
});

app.get("/api/v2", (req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl);
  sreq.pipe(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sreq.on("end", () => {
    console.log("v2: ok");
  });
});

app.get("/api/v1/posts", (req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl);
  sreq.pipe(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sreq.on("end", () => {
    console.log("v1-posts: ok");
  });
});

app.get("/api/v1/posts/:id", (req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl);
  sreq.pipe(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sreq.on("end", () => {
    console.log("v1-posts-id: ok");
  });
});

app.get("/api/v1/posts/:id/related", (req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl);
  sreq.pipe(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sreq.on("end", () => {
    console.log("v1-posts-related: ok");
  });
});

app.get("/api/v1/posts/hot_in_week", (req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl);
  sreq.pipe(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sreq.on("end", () => {
    console.log("hot_in_week: ok");
  });
});

app.get("/api/v1/columns/:id", (req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl);
  sreq.pipe(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sreq.on("end", () => {
    console.log("columns: ok");
  });
});

//JHU rebulid
//时间列表
app.get("/api/v2/ncov_cases/timeline/page=:id", (req, res) => {
  axios
    .get(
      TimeAPI + "/data/json/NcovTimeline/data__asc_" + req.params.id + ".json"
    )
    .then(item => {
      let moth = [],
        flag = 0,
        list = item.data.data;
      let wdy = {
        title: "",
        info: ""
      };
      for (let i = 0; i < list.length; i++) {
        let az = "";
        for (let j = 0; j < moth.length; j++) {
          if (moth[j].title === list[i]["time_point"]) {
            flag = 1;
            az = j;
            break;
          }
        }
        if (flag === 1) {
          let ab = moth[az];
          ab.info.push(list[i]);
          flag = 0;
        } else if (flag === 0) {
          wdy = {};
          wdy.title = list[i]["time_point"];
          wdy.info = [];
          wdy.info.push(list[i]);
          moth.push(wdy);
        }
      }
      let rebuild = {
        status: res.statusCode,
        data: moth
      };
      res.send(rebuild);
    });
});
//肺炎小区查询
app.get("/api/getCommunity", (req, res) => {
  let sreq = request.get(HostAPI + req.originalUrl);
  sreq.pipe(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sreq.on("end", () => {
    console.log("getCommunity");
  });
});

app.get("/api/getStatusByPosition", (req, res) => {
  let sreq = request.get(HostAPI + req.originalUrl);
  sreq.pipe(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sreq.on("end", () => {
    console.log("getStatusByPosition");
  });
});

app.get("/api/v2/ncov_cases/:id", (req, res) => {
  let t;
  //首页数据
  if (req.params.id === "0") {
    axios
      .get(JHUAPI + "/cases_time_v2/FeatureServer/0?f=json")
      .then(res => {
        t = utils.dateFormat(
          res.data.editingInfo.lastEditDate,
          "yyyy-MM-dd hh:mm:ss"
        );
      })
      .then(() => {
        axios
          .get(
            JHUAPI +
              "/ncov_cases/FeatureServer/1/query?f=json&where=1=1&returnGeometry=false&outFields=*&orderByFields=Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc"
          )
          .then(ress => {
            let confirmedArry = [],
              deathsArry = [],
              recoveredArry = [];
            let datas = ress.data;
            datas.features.map(item => {
              confirmedArry.push(item.attributes.Confirmed);
              recoveredArry.push(item.attributes.Recovered);
              deathsArry.push(item.attributes.Deaths);
            });
            let rebuild = {
              status: res.statusCode,
              update: t,
              confirmed: utils.calcSum(confirmedArry),
              recovered: utils.calcSum(recoveredArry),
              deaths: utils.calcSum(deathsArry)
            };

            res.send(rebuild);
          });
      });
  }

  //全球确诊数据
  if (req.params.id === "1") {
    axios
      .get(
        JHUAPI +
          "/ncov_cases/FeatureServer/2/query?f=json&where=1=1&returnGeometry=false&outFields=*&orderByFields=Confirmed%20desc"
      )
      .then(ress => {
        let rebuild = {
          status: res.statusCode,
          data: ress.data.features
        };

        res.send(rebuild);
      });
  }

  //国内确诊数据
  if (req.params.id === "2") {
    axios
      .get(
        JHUAPI +
          "/ncov_cases/FeatureServer/1/query?f=json&where=1=1&returnGeometry=false&outFields=*&orderByFields=Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc"
      )
      .then(ress => {
        let rebuild = {
          status: res.statusCode,
          data: ress.data.features
        };

        res.send(rebuild);
      });
  }

  //趋势图
  if (req.params.id === "3") {
    axios
      .get(
        JHUAPI +
          "/cases_time_v3/FeatureServer/0/query?f=json&where=1=1&returnGeometry=false&outFields=*&orderByFields=Report_Date_String%20asc"
      )
      .then(ress => {
        let dateArry = [],
          chinaArry = [],
          otherArry = [];
        ress.data.features.map(item => {
          dateArry.push(
            utils.dateFormat(item.attributes.Report_Date, "MM月dd日")
          );
          chinaArry.push(item.attributes.Mainland_China);
          otherArry.push(item.attributes.Other_Locations);
        });

        let rebuild = {
          status: res.statusCode,
          data: {
            time: dateArry,
            china: chinaArry,
            other: otherArry
          }
        };

        res.send(rebuild);
      });
  }

  //全球地图
  if (req.params.id === "4") {
    axios
      .get(
        JHUAPI +
          "/ncov_cases/FeatureServer/1/query?f=json&where=1=1&returnGeometry=false&outFields=*&orderByFields=Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc"
      )
      .then(ress => {
        let dad = ress.data.features;
        let ok = [];
        dad.map(i => {
          let son = i.attributes;
          ok.push({
            geometry: {
              type: "Point",
              coordinates: [son.Long_, son.Lat]
            },
            properties: {
              confirmed: son.Confirmed,
              country: son.Province_State || son.Country_Region
            }
          });
        });

        let rebuild = {
          status: res.statusCode,
          type: "FeatureCollection",
          features: ok
        };

        res.send(rebuild);
      });
  }
});

app.get("/", (req, res) => {
  res.send('Status:' + res.statusCode)
});

let listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
