const express = require('express');
const request = require('superagent');
const http = require('http');

const app = express();
const HostAPI = 'https://ncov.html5.qq.com';
const JHUAPI = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services';
const TechAPI = 'https://mainssl.geekpark.net';
const TimeAPI = 'http://h5.oeeee.com'

app.set('port', (process.env.PORT || 5000));

app.all('*', ((req, res, next) => {
  if (!req.get('Origin')) return next();
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  if (req.method === 'OPTIONS') return res.send(200);
  next();
}));

app.get('/', ((req, res) => {
  res.sendFile(__dirname + "/views/index.html");
}));

//肺炎小区查询
app.get('/api/getCommunity', ((req, res) => {
    let sreq = request.get(HostAPI + req.originalUrl)
    sreq.pipe(res);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    sreq.on('end', (() => {
        console.log('getCommunity');
    }));
}));

app.get('/api/getStatusByPosition', ((req, res) => {
    let sreq = request.get(HostAPI + req.originalUrl)
    sreq.pipe(res);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    sreq.on('end', (() => {
        console.log('getStatusByPosition');
    }));
}));

//获取JHU数据
app.get('/cases_time_v2/FeatureServer/0', ((req, res) => {
    let sreq = request.get(JHUAPI + req.originalUrl)
    sreq.pipe(res);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    sreq.on('end', (() => {
        console.log('0');
    }));
}));

app.get('/ncov_cases/FeatureServer/1/query', ((req, res) => {
    let sreq = request.get(JHUAPI + req.originalUrl)
    sreq.pipe(res);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    sreq.on('end', (() => {
        console.log('1');
    }));
}));

app.get('/ncov_cases/FeatureServer/2/query', ((req, res) => {
    let sreq = request.get(JHUAPI + req.originalUrl)
    sreq.pipe(res);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    sreq.on('end', (() => {
        console.log('2');
    }));
}));

app.get('/cases_time/FeatureServer/0/query', ((req, res) => {
    let sreq = request.get(JHUAPI + req.originalUrl)
    sreq.pipe(res);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    sreq.on('end', (() => {
        console.log('3');
    }));
}));

app.get('/cases_time_v3/FeatureServer/0/query', ((req, res) => {
    let sreq = request.get(JHUAPI + req.originalUrl)
    sreq.pipe(res);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    sreq.on('end', (() => {
        console.log('3');
    }));
}));

//tech数据
app.get('/api/v1', ((req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl)
  sreq.pipe(res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  sreq.on('end', (() => {
    console.log('v1: ok');
  }));
}));

app.get('/api/v2', ((req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl)
  sreq.pipe(res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  sreq.on('end', (() => {
    console.log('v2: ok');
  }));
}));

app.get('/api/v1/posts', ((req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl)
  sreq.pipe(res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  sreq.on('end', (() => {
    console.log('v1-posts: ok');
  }));
}));

app.get('/api/v1/posts/:id', ((req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl)
  sreq.pipe(res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  sreq.on('end', (() => {
    console.log('v1-posts-id: ok');
  }));
}));

app.get('/api/v1/posts/:id/related', ((req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl)
  sreq.pipe(res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  sreq.on('end', (() => {
    console.log('v1-posts-related: ok');
  }));
}));

app.get('/api/v1/posts/hot_in_week', ((req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl)
  sreq.pipe(res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  sreq.on('end', (() => {
    console.log('hot_in_week: ok');
  }));
}));

app.get('/api/v1/columns/:id', ((req, res) => {
  let sreq = request.get(TechAPI + req.originalUrl)
  sreq.pipe(res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  sreq.on('end', (() => {
    console.log('columns: ok');
  }));
}));

//TimeLine
app.get('/data/json/NcovTimeline/data__asc_2.json', ((req, res) => {
  let sreq = request.get(TimeAPI + req.originalUrl);
  sreq.pipe(res);
  sreq.then((item) => {
    console.log(item)
  })
  
  res.setHeader('Content-Type', 'text/html; charset=uft-8');
  sreq.on('end', (() => {
    console.log('timeline');
  }))
}))

setInterval(function () {
    http.get("http://naives.glitch.me");
}, 200000);

app.listen(app.get('port'), (() => {
  console.log('running on http://localhost:'+ app.get('port'));
}));