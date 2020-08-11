//imports
var app = require('express')();
var url = require('url');
var fs = require('fs');


//apiKey Map
var apiKeys = new Map();

apiKeys.set('ping','a1337');


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
            //code goes brr
            res.send(fs.readFileSync(`./source/${_source}.js`));
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