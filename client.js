//imports
var http = require('http');


//used APIKey in plaintext
var apiKey = "a1337";


//base64 go brrr
apiKey = new Buffer(apiKey).toString('base64');


//request options
var opt = {
    host: "localhost",
    port: "5566",
    path: `/getSource?source=ping&api=${apiKey}`
}

//http request
callback = function(response) {
    var str = '';
  
    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
  
    //the whole response has been received, so we just print it out here
    response.on('end', function () {
        eval(str);
    });
  }
  
  http.request(opt, callback).end();