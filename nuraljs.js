//Standard Libraries
var wifi=require("ESP8266WiFi_0v25");
var http=require("http");

//NuralJS Libraries
var lcdmodule=require("https://github.com/JerryCFox/nuraljs_microdriver_lcd/blob/master/nuraljs_microdriver_lcd.js");
var wifimodule=require("https://github.com/JerryCFox/nuraljs_microdriver_esp01/blob/master/nuraljs_microdriver_esp01.js");
var logger=require("https://github.com/JerryCFox/nuraljs_micro_logger/blob/master/nuraljs_micro_logger.js");
var webcore=require("https://github.com/JerryCFox/nuraljs_micro_webcore/blob/master/nuraljs_micro_webcore.js");

//Pins for LCD Module
I2C1.setup({scl:B6,sda:B7});

//Pins for Wifi Module
digitalWrite(B9,1);//enables pico wifi shim
Serial2.setup(115200,({rx:A3, tx:A2}));

var memorylogger;
var http;

//INITIALIZE
lcdmodule.init({                                      //ENABLE LCD
  lcd:require("SSD1306"),
  method:I2C1
},function(err,status){
  if(status) console.log(status);
  if(err) throw err;
  logger.init({                                       //ENABLE LOGGER
    lcd:lcdmodule,
    lcdconfig:{lines:5},
  },function(err,status){
    if(status) logger.log(status);
    if(err) throw err;
    logger.log("Starting wifi module...");
    wifimodule.init({                                 //Enable WIFI
      wifi:wifi,
      method:Serial2,
      mode:"AP",
      APconfig:{
        name:"ESP8266wifi",
        password:"HelloWorld",
        method:"wpa2_psk",
        channel:5
      }
    },function(err,status){
      if(status) logger.log(status);
      if(err) throw err;
      webcore.init({                                  //Enable Webcore
        logger:logger,
      },function(err,status){
        if(status) logger.log(status);
        if(err) throw err;
        logger.log("Serving at IP: " + wifimodule.details());
        http.createServer(function(req,res){          //Enable Server
          webcore.routes(req,res,function(err,res){
            res.end();
            if(err) throw err;
          });
        }).listen(80);
        memorylogger=setInterval(function(){logger.log("RAM:"+process.memory().free);},30000);
      });
    });
  });
});

save();
