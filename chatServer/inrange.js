
var serialport = require("serialport");// version 4
var shellescape = require('shell-escape');
var portName = "/dev/ttyACM0";
var shell = require('shelljs');

var time = new Date();

var myPort = new serialport(portName, {
    baudRate: 9600,
    parser: new serialport.parsers.readline('\r\n')
});

myPort.on('open', function onOpen(){
    console.log('Open connections!');
});

myPort.on('data', function onData(data){
    var d = data.split(" ");
    console.log("data: ", d[0]);
    if(d[0] < 50){ 
      shell.exec("node chat.js");
      
    }
   
});

myPort.on('error', function(err) {
  console.log('Error: ', err.message);
})





