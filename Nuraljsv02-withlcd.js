var http = require("http");
var secret=0;
var macpage="esp8266-01";
var setpage="Set Successfull";
var setpagealready="Device Already Set";
var successpage="PassKey Successfull";

function testLCDwrite(){
 // write some text
 lcd.drawString("Hello World!",2,2);
 // write to the screen
 lcd.flip(); 
}
var lcd;
// I2C

function lcdWrite(message){
   lcd.clear();
   lcd.drawString(message,2,2);
   // write to the screen
   lcd.flip(); 
}

function onInit(){
  I2C1.setup({scl:B6,sda:B7});
  lcd = require("SSD1306").connect(I2C1, testLCDwrite);
}

digitalWrite(B9,1);//enables pico wifi shim
Serial2.setup(115200,({rx:A3, tx:A2}));

var wifi = require("ESP8266WiFi_0v25").connect(Serial2,function(err){
  if(err)throw err;
  wifi.reset(function(err){
    if(err)throw err;
    console.log("connected");
    wifi.createAP("esp8266", "HelloWorld",5,"wpa2_psk",function(err){
      if(err)throw err;
      lcdWrite("hotspotCreated");
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