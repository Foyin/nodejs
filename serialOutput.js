//This code uses prints out information from
// serial port using serialport.js 

var serialport = require("serialport");// version 4.0.7
var portName = "/dev/ttyACM0"; //specify your port name

var myPort = new serialport(portName, {
    baudRate: 9600,
    parser: new serialport.parsers.readline('\r\n')
});

myPort.on('open', function onOpen(){
    console.log('Open connections!');
});

myPort.on('data', function onData(data){
    console.log(data);
});

myPort.on('error', function(err) {
  console.log('Error: ', err.message);
})
