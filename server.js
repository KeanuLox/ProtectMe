var app = require('express')();
var url = require('url');
var fs = require('fs');

var apiKeys = new Map();

apiKeys.set('ping','a1337');

app.get('/getSource',(req,res) => {
    var _apiKey = url.parse(req.url,true).query.api;
    var _source = url.parse(req.url,true).query.source;

    if(_apiKey != undefined && _source != undefined) {
        var key = apiKeys.get(_source);
        if(key == _apiKey) {
            res.send(fs.readFileSync(`./source/${_source}.js`));
        } else if(key == undefined) {
            res.send('console.log("source not found.")');
        } else {
            res.send('console.log("wrong api key.");');
        }
    } else {
        res.send("console.log('more parameters needed');");
    }
});

app.listen(5566,() => {
    console.log("started.");
});