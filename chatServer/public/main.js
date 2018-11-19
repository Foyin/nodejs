$(function() { 

  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();
  var enterKey = jQuery.Event("keydown");
  var userAgent = window.navigator.userAgent;
  enterKey.which = 13;

  var socket = io();


  const addParticipantsMessage = (data) => {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
   
  }

  const addOnlineuser = (data) => {
    var d = Date();
    var date = d.split(" ");
    $("#userPanel").append("<ul><li>"+ data.username +" Joined at "+ date[4] +"</li></ul>")
  }

  const removeOnlineuser = (data) => {
    var d = Date();
    var date = d.split(" "); 
    $("#userPanel li").remove(":contains('" + data.username + "')")
  }

  // Sets the client's username
  const setUsername = () => {
    username = cleanInput($usernameInput.val().trim());
    // If the username is valid
    if (username) {
      responsiveVoice.speak("Welcome");
      $("#userBtn").text(username);
      $loginPage.fadeOut();
      if(userAgent.includes("iPhone") || userAgent.includes("iPad") || userAgent.includes("Android")){
        console.log("iphone connected");
        alert("Works Best In Landscape");
      }
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Sends a chat message
  const sendMessage = () => {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
    const log = (message, options) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  const addChatMessage = (data, options) => {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  /*
  // Adds the visual chat typing message (lets you know when someone is typing)
  const addChatTyping = (data) => {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }
  */

  // Removes the visual chat typing message
  const removeChatTyping = (data) => {
    getTypingMessages(data).fadeOut(() => {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  const addMessageElement = (el, options) => {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }

  // Updates the typing event
  const updateTyping = () => {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(() => {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  const getTypingMessages = (data) => {
    return $('.typing.message').filter(i => {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  const getUsernameColor = (username) => {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(event => {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', () => {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(() => {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(() => {
    $inputMessage.focus();
  });

  

  //button functions
  //user
  $(".btn").click(function(){
     if(this.id === "userBtn"){  
         $(".sidePanel").hide();
         $("#userPanel").show();
     }     
  });
  
  //upload
  $(".btn").click(function(){
     if(this.id === "uploadBtn"){  
         $(".sidePanel").hide();
         $("#uploadPanel").show();
     }     
  });

  //download
  $(".btn").click(function(){
     if(this.id === "downloadBtn"){  
         $(".sidePanel").hide();
         $("#downloadPanel").show();   
     }
  });

  //video chat
  $(".btn").click(function(){
     if(this.id === "vBtn"){  
         $(".sidePanel").hide();
         $("#vcPanel").show();
     }
  });

  //white board
  $(".btn").click(function(){
     if(this.id === "WBtn"){  
         $(".sidePanel").hide();
         $("#wbPanel").show();
     }
  });
  
  //Night mode button
  var nMode = $("#nMode");
  //Night mode button original name
  nMode.data("text-original", nMode.text());

  //day or night mode
  var nightMode1 = function(){
     nMode.text(nMode.data("text-swap"));
     $(".btn").css("background-color", "#3498DB");
     $(".btn").css("border-color", "black");
     $(".btn").css("color", "#D6DBDF");
     $(".options").css("background-color", "#85929E");
     $(".chatArea").css("border-color", "#85929E");
     $(".chatArea").css("background-color", "#34495E");
     $(".chatArea").css("color", "#D6DBDF");
     $(".inputMessage").css("border-color", "#85929E");
     $(".inputMessage").css("background-color", "#34495E");
     $(".inputMessage").css("color", "#D6DBDF");
     $(".sidePanel").css("border-color", "#85929E");
     $(".sidePanel").css("background-color", "#34495E");
     $(".sidePanel").css("color", "#D6DBDF");

  }

  var nightMode2 = function(){
     nMode.text(nMode.data("text-swap"));
     $(".btn").css("background-color", "#808B96");
     $(".btn").css("border-color", "black");
     $(".btn").css("color", "black");
     $(".options").css("background-color", "#1B2631");
     $(".chatArea").css("border-color", "#1B2631");
     $(".chatArea").css("background-color", "#17202A");
     $(".chatArea").css("color", "#D6DBDF");
     $(".inputMessage").css("border-color", "#1B2631");
     $(".inputMessage").css("background-color", "#17202A");
     $(".inputMessage").css("color", "#D6DBDF");
     $(".sidePanel").css("border-color", "#1B2631");
     $(".sidePanel").css("background-color", "#17202A");
     $(".sidePanel").css("color", "#D6DBDF");
  }

  var nightMode3 = function(){
     nMode.text(nMode.data("text-swap"));
     $(".btn").css("background-color", "#3498DB");
     $(".btn").css("border-color", "black");
     $(".btn").css("color", "#D6DBDF");
     $(".options").css("background-color", "#154360");
     $(".chatArea").css("border-color", "#154360");
     $(".chatArea").css("background-color", "#1B2631");
     $(".chatArea").css("color", "#D6DBDF");
     $(".inputMessage").css("border-color", "#154360");
     $(".inputMessage").css("background-color", "#1B2631");
     $(".inputMessage").css("color", "#D6DBDF");
     $(".sidePanel").css("border-color", "#154360");
     $(".sidePanel").css("background-color", "#1B2631");
     $(".sidePanel").css("color", "#D6DBDF");
  }


  var dayMode = function(){
     nMode.text(nMode.data("text-original"));
     $(".btn").css("background-color", "white");
     $(".btn").css("border-color", "rgb(92, 176, 226)");
     $(".btn").css("color", "dodgerBlue");
     $(".options").css("background-color", "powderblue");
     $(".chatArea").css("border-color", "powderblue");
     $(".chatArea").css("background-color", "white");
     $(".chatArea").css("color", "black");
     $(".inputMessage").css("border-color", "powderblue");
     $(".inputMessage").css("background-color", "white");
     $(".inputMessage").css("color", "black");
     $(".sidePanel").css("border-color", "powderblue");
     $(".sidePanel").css("background-color", "white");
     $(".sidePanel").css("color", "black");
  }
 

  //Switch for night mode
  var state = 0;
  $(".btn").click(function(){
     if(this.id === "nMode"){  
        if(state === 0){
             nightMode2();
             state = 1;
        }
        else{
             dayMode();
             state = 0;
        }
     }
  });

  //Voice controls
  if (annyang) {
    annyang.debug();  
    $("#mic").css("background-color", "grey");
    var helloCmd = {
        'hello': function() {
        responsiveVoice.speak("hi");
      }
    };
  
    var userCmd = { 
       'main': function() {
        $(".sidePanel").hide();
        $("#userPanel").show();
      }
    };

    var uploadCmd = { 
       'upload': function() {
        $(".sidePanel").hide();
        $("#uploadPanel").show();
      }
    };

    var downloadCmd = { 
       'download': function() {
        $(".sidePanel").hide();
        $("#downloadPanel").show(); 
      }
    };

    var videochatCmd = { 
       'video': function() {
        $(".sidePanel").hide();
        $("#vcPanel").show();
      }
    };

    var whiteboardCmd = { 
       'whiteboard': function() {
        $(".sidePanel").hide();
        $("#wbPanel").show();
      }
    };

    var nightmodeCmd = {  
       'dark': function() {
        nightMode2();
      }
    };

    var daymodeCmd = {  
       'light': function() {
        dayMode();
      }
    };

    var state = 0;
    $("#mic").click(function(){
      if(state === 0){
         //responsiveVoice.speak("microphone on");
         annyang.start({continuous: false });
         $("#mic").css("background-color", "red");
         state = 1;
      }
      else{
         annyang.pause();
         responsiveVoice.speak("microphone off");
         $("#mic").css("background-color", "grey");
         state = 0;
      }
    });

    annyang.addCallback('result', function(phrases) {
       $(".inputMessage").val(phrases[0]);
        });

    annyang.addCommands(helloCmd);
    annyang.addCommands(userCmd);
    annyang.addCommands(uploadCmd);
    annyang.addCommands(downloadCmd);
    annyang.addCommands(videochatCmd);
    annyang.addCommands(whiteboardCmd);
    annyang.addCommands(nightmodeCmd);
    annyang.addCommands(daymodeCmd);
  }  

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', (data) => {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Paradise";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });
  
  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', (data) => {
    var d = Date();
    var date = d.split(" ");
    log(data.username + ' joined at ' +date[4]);
    addOnlineuser(data);
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', (data) => {
    var d = Date();
    var date = d.split(" ");
    log(data.username + ' left at ' +date[4]);
    removeOnlineuser(data);
     
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', (data) => {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', (data) => {
    removeChatTyping(data);
  });

  socket.on('disconnect', () => {
    log('you have been disconnected');
  });

  socket.on('reconnect', () => {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', () => {
    log('attempt to reconnect has failed');
  });
/*
  document.addEventListener("DOMContentLoaded", function(){
 
    // Initialize instances:
    var socket = io.connect();
    var siofu = new SocketIOFileUpload(socket);
 
    // Configure the three ways that SocketIOFileUpload can read files:
    document.getElementById("upload_btn").addEventListener("click", siofu.prompt, false);
    siofu.listenOnInput(document.getElementById("upload_input"));
    siofu.listenOnDrop(document.getElementById("file_drop"), function(event){
        $("#file_drop").append("<p>" + event.file + "</p>");
    });

    // Do something on upload progress:
    siofu.addEventListener("progress", function(event){
        var percent = event.bytesLoaded / event.file.size * 100;
        console.log("File is", percent.toFixed(2), "percent loaded");
    });
 
    // Do something when a file is uploaded:
    siofu.addEventListener("complete", function(event){
        console.log(event.success);
        console.log(event.file);
    });
 
}, false);  
*/
});
