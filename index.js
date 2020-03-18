const express = require("express");
const request = require("superagent");
const compression = require('compression');
const axios = require("axios");
const utils = require("./utils");
const fs = require('fs');

const app = express();

const HostAPI = "https://ncov.html5.qq.com";
const JHUAPI =
  "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services";
const TimeAPI = "http://m.mp.oeeee.com";

app.use(compression());

app.get("/", (req, res) => {
  res.send('Unavailable For Legal Reasons')
});

app.all("*", (req, res, next) => {
  if (!req.get("Origin")) return next();
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  if (req.method === "OPTIONS") return res.send(200);
  next();
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
        status: 200,
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

//show
app.get("/show", (req, res) => {
  fs.readdir('/tmp', 'utf8', (err, data) => {
    res.send(data);
  })
});

//首页数据
app.get("/api/v2/ncov_cases/0", (req, res) => {
  axios.get('https://m.sm.cn/api/rest?format=json&method=Huoshenshan.healingLocal&uc_param_str=gi').then((i) => {
    let today = {
      time: i.data.time,
      y_sure_cnt: i.data.colums[0].list[0].incr,
      y_cure_cnt: i.data.colums[0].list[2].incr,
      y_die_cnt: i.data.colums[0].list[3].incr,
      t_sure_cnt: i.data.colums[0].list[0].current,
      t_cure_cnt: i.data.colums[0].list[2].current,
      t_die_cnt: i.data.colums[0].list[3].current
    }

    axios.get('https://api.m.sm.cn/rest?format=json&method=Huoshenshan.healingCity&mapType=1').then((p) => {
      let rebuild = {
        status: 200,
        domestic: {
          info: today,
          list: p.data.list
        },
        foreign: p.data.foreign
      }

      res.send(rebuild)
    })
  })

});

//趋势图
app.get("/api/v2/ncov_cases/1", (req, res) => {
  axios.get(JHUAPI + "/cases_time_v3/FeatureServer/0/query?f=json&where=1=1&returnGeometry=false&outFields=*&orderByFields=Report_Date_String%20asc").then(p => {
      let domestic = [], foreign = [], confirmed = [], recovered = [];
      p.data.features.map((item) => {
        domestic.push({
          time: utils.dateFormat(item.attributes.Report_Date, 'yyyy-MM-dd'),
          value: item.attributes.Mainland_China,
          type: '国内'
        })

        foreign.push({
          time: utils.dateFormat(item.attributes.Report_Date, 'yyyy-MM-dd'),
          value: item.attributes.Other_Locations,
          type: '国外'
        })

        confirmed.push({
          time: utils.dateFormat(item.attributes.Report_Date, 'yyyy-MM-dd'),
          value: item.attributes.Total_Confirmed,
          type: '确诊'
        })

        recovered.push({
          time: utils.dateFormat(item.attributes.Report_Date, 'yyyy-MM-dd'),
          value: item.attributes.Total_Recovered,
          type: '治愈'
        })
      });

      let rebuild = {
        status: 200,
        data: {
          domestic: domestic,
          foreign: foreign,
          confirmed: confirmed,
          recovered: recovered
        }
      }

      res.send(rebuild)
    });
});

//全球地图
app.get("/api/v2/ncov_cases/2", (req, res) => {
  axios.get(JHUAPI + "/ncov_cases/FeatureServer/1/query?f=json&where=1=1&returnGeometry=false&outFields=*&orderByFields=Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc").then(p => {
    let dad = p.data.features;
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
      status: 200,
      type: "FeatureCollection",
      features: ok
    };

    res.send(rebuild)
  });
});

let listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
