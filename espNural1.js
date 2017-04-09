var wifi = require("Wifi");
wifi.startAP("my-ssid", {password:"my-password"});

var mainpage="<html>";
mainpage+="<h1>Hello World</h1>";
mainpage+="</html>";

var http = require("http");
http.createServer(function (req, res) {
  res.writeHead(200);
  res.end(mainpage);
}).listen(80);