var http = require("http");
var secret=0;
var macpage="esp8266-01";
var setpage="Set Successfull";
var setpagealready="Device Already Set";
var successpage="PassKey Successfull";



digitalWrite(B9,1);//enables pico wifi shim
Serial2.setup(115200,({rx:A3, tx:A2}));

var wifi = require("ESP8266WiFi_0v25").connect(Serial2,function(err){
  if(err)throw err;
  wifi.reset(function(err){
    if(err)throw err;
    console.log("connected");
    wifi.createAP("esp8266", "HelloWorld",5,"wpa2_psk",function(err){
      if(err)throw err;
      //lcdWrite("hotspotCreated");
      wifi.getIP(function(err,ipOb){
        if(err)throw err;
        console.log(ipOb);
        http.createServer(function (req, res) {
          console.log(JSON.stringify(req,undefined,4));
          var url=req.url;
          if(url.slice(1,6)==secret&&secret!==0){
            res.writeHead(200);
            res.end(successpage);
          }
          else if(url.slice(1,4)=="set"){
            if(secret===0){
              secret=url.slice(5,10);
              console.log(secret);
              //lcdWrite(secret);
              res.writeHead(200);
              res.end(setpage);
            }
            else{
              res.writeHead(200);
              res.end(setpagealready);
            }
          }
          else{
            res.writeHead(200);
            res.end(macpage);
          }
        }).listen(80);
      });
    });
  });
});
save();