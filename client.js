//imports
var http = require('http');


//used APIKey in plaintext
var apiKey = "a1337";


//base64 go brrr
apiKey = new Buffer(apiKey).toString('base64');

var _current = "";
var updateNotify = false;
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
      if(_current == "") {
        _current = str;  
        eval(str);
      } else {
        if(_current != str && !updateNotify) {
          console.log("New Update is available. Please restart your script.");
          updateNotify = true;
        }
      }
    });
  }
  
  http.request(opt, callback).end();
  setInterval(() => {
    http.request(opt,callback).end();
  },2000);