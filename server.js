//imports
var app = require('express')();
var url = require('url');
var fs = require('fs');


//masterKey for APIKey generation
var masterKey = "1337a1337";

//apiKey Map
var apiKeys = new Map();

var apiKeyIPs = new Map();

setInterval(() => {
    fs.readFileSync('./apiKeys.txt').toString().split('\n').forEach(_raw => {
        var _apiKey = _raw.split(',')[0];
        var _source = _raw.split(',')[1];
        var _ip = _raw.split(',')[2];
    
        if(apiKeys.get(_source) == undefined) {
            console.log('new apiKey found: ' + _apiKey);
            apiKeys.set(_source,_apiKey);
            apiKeyIPs.set(_apiKey,_ip);
            console.log('new apiKey registered: ' + _apiKey);
        }
    });
},2000);


app.get('/createAPIKey',(req,res) => {
    //queries
    var _masterKey = new Buffer(url.parse(req.url,true).query.mkey);
    var _apiKey = new Buffer(url.parse(req.url,true).query.api,'base64').toString('ascii');
    var _source = url.parse(req.url,true).query.source;
    var _ip = url.parse(req.url,true).query.ip;

    //ask if queries exists
    if(_apiKey != undefined && _source != undefined && _ip != undefined) {
        //ask if the original masterkey and the sended one are the same
        if(_masterKey == masterKey) {
            fs.writeFileSync('./apiKeys.txt',`${fs.readFileSync('./apiKeys.txt')}\n_${_apiKey},${_source},${_ip}`);
            apiKeys.set(_source,_apiKey);
            res.send('apiKey created.');
        } else {
            //error message
            res.send('wrong masterkey.');
        }
    }
})

//getSource Route
app.get('/getSource',(req,res) => {
    //queries
    var _apiKey = new Buffer(url.parse(req.url,true).query.api,'base64').toString('ascii');
    var _source = url.parse(req.url,true).query.source;

    //ask if queries exists
    if(_apiKey != undefined && _source != undefined) {
        //ask if the original apiKey and the sended one are the same
        var key = apiKeys.get(_source);
        if(key == _apiKey) {
            if(req.ip == apiKeyIPs.get(_apiKey)) {
                //code goes brr
                res.send(fs.readFileSync(`./source/${_source}.js`));
            } else {
                res.send('console.log("ip blocked");');
            }
        } else if(key == undefined) {
            //error message
            res.send('console.log("source not found.")');
        } else {
            //error message
            res.send('console.log("wrong api key.");');
        }
    } else {
        //error message
        res.send("console.log('more parameters needed');");
    }
});

//http listener
app.listen(5566,() => {
    console.log("started.");
});