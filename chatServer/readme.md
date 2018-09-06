# Chat server

#### Purpose: 
Chat app with shared drawing board and other upcoming features. Also has voice
controls features that enable you to type with voice, change panels and display mode
(works on google chrome). Also has voice output capabilities. Im looking into 
tweaking this and making a complete voice controlled UI.
More features coming
soon

#### Notes:
Say "dark" for night mode and "light" for light mode
Say name of panels to change panels
Click grey button to switch on microphone listening
You would need to download and install the following tools
Say "hello" and app will respond

- [nodejs(version 5 - 9)](https://nodejs.org/en/)
- [jQuery](https://jquery.com/)
- [npm](https://www.npmjs.com/)
- [p5js](https://p5js.org/)
- [annyangjs](https://www.talater.com/annyang/) (extends [webkitspeechrecognition](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API))
- [responsivevoicejs](https://responsivevoice.org/)

This app was designed to be used on a touch screen tablet (thats why the butons are so big)

After getting all required files, to run type enter chatSever directory and use the command:

`node index.js` to run with HTTP

`node index-https.js` to run with HTTPS with a self signed key

You can chat with anyone on the same network (or WIFI) as you, just use command `ifconfig` to get the ip address that your
router gave to the computer that is running the server(localhost) then go to `<IPAddress>:<PortNumber>` example: `192.168.0.11:5000`

![loginpage](https://user-images.githubusercontent.com/15314851/44919887-8c4efe00-ad0c-11e8-92dd-bf3e3871af5e.png)

![chatboard2](https://user-images.githubusercontent.com/15314851/44919909-953fcf80-ad0c-11e8-889c-bf0915a636e3.png)

![chatboard](https://user-images.githubusercontent.com/15314851/44919929-a2f55500-ad0c-11e8-8432-9609680ae1aa.png)

![chatmic](https://user-images.githubusercontent.com/15314851/44919934-a7ba0900-ad0c-11e8-9f96-2a661fa7e9c5.png)
