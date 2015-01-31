function addClientName(name) {
  var names = document.getElementById('names');
  var newName = document.createElement('div');
  newName.className = 'name';
  newName.id = name;
  newName.innerHTML = name;
  names.appendChild(newName);
}


function addMessage(data) {
  var messages = document.getElementById('messages');
  var messager = document.createElement('div');
  messager.className = 'messager';
  messager.innerHTML = data.messager + " : " ;
  messages.appendChild(messager);
  var message = document.createElement('div');
  message.className = 'message';
  message.innerHTML = data.message;
  messages.appendChild(message);
  var scrollObj = document.getElementById('messages');
  scrollObj.scrollTop = scrollObj.scrollHeight;
  var inputObj = document.getElementById('inputMessage');
  inputObj.value = '';
}

function removeUser(name) {
  var names = document.getElementById('names');
  var user = document.getElementById(name);
  names.removeChild(user);
}

window.onload = function() {
  console.log('Connected');

  var server = io.connect('http://172.16.21.4:3000');

  // Get the nickname
  var nick = '';
  while (nick === '') {
    nick = prompt('To join the conversation enter your nickname: ');
  }

  var messageObj = document.getElementById('inputMessage');
  messageObj.focus();
  messageObj.addEventListener('keydown',function(event){
    if(event.keyCode == 13) {
      send.click();
    }
  });

    // tell the server you want to join the server
  server.emit('join', {name : nick});

  // the sever acknowledges that you have joined the room
  server.on('joined', function(data) {
    data.forEach(function(name) {
      addClientName(name);
    });
  });

  // a new user has joined
  server.on('newUser', function(data) {
    addClientName(data.name);
  });

  // send the sever a new   message
  var send = document.getElementById('submit');
  send.addEventListener('click', function(event) {
    var message = document.getElementById('inputMessage').value;
    server.emit('message', {
      messager : nick,
      message : message
    });
  });

  // the server acknowledged the message
  server.on('messageAck', function(data) {
    addMessage(data);
  });

  // the server is broadcasting a message
  server.on('newMessage', function(data) {
    console.log(data);
    addMessage(data);
  });

  // if a user lefts chatty
  server.on('userLeft', function(data) {
    removeUser(data.name);
  });

};

