var wifi = require("Wifi");
wifi.startAP("my-ssid", {password:"my-password"});

var secret=0;
var macpage="";
wifi.getIP(function(ipOb){
  macpage+=ipOb.mac;
});

var setpage="";
setpage+="SetSuccessfull";

var successpage="";
successpage+="PassKeySuccessfull";


var http = require("http");
http.createServer(function (req, res) {
  console.log(JSON.stringify(req,undefined,4));
  var url=req.url;
  if(url.slice(1,6)==secret){
    res.writeHead(200);
    res.end(successpage);
  }
  else if(url.slice(1,4)=="set"){
    secret=url.slice(5,10);
    console.log(secret);
    res.writeHead(200);
    res.end(setpage);
  }
  else{
    res.writeHead(200);
    res.end(macpage);
  }
}).listen(80);