function addClientName(name) {
  var names = document.getElementById('names');
  var newName = document.createElement('div');
  newName.className = 'name';
  newName.id = name;
  newName.innerHTML = name;
  names.appendChild(newName);
  var infoTag = document.getElementById('info');
  var clientAdded = document.createElement('div');
  clientAdded.id = "client";
  clientAdded.innerHTML = name + ' is online';
  infoTag.appendChild(clientAdded);
}


function addMessage(data) {
  var messages = document.getElementById('messages');
  var row = document.createElement('div');
  row.className = "row messageRow";
  var messager = document.createElement('div');
  messager.className = 'col-md-2 messager text-right';
  messager.innerHTML = data.messager + " : " ;
  row.appendChild(messager);
  var message = document.createElement('div');
  message.className = 'col-md-10 message text-left';
  message.innerHTML = data.message;
  row.appendChild(message);
  messages.appendChild(row);
  var scrollObj = document.getElementById('messages');
  scrollObj.scrollTop = scrollObj.scrollHeight;
}

function removeUser(name) {
  var names = document.getElementById('names');
  var user = document.getElementById(name);
  names.removeChild(user);
  var infoTag = document.getElementById('info');
  var clientLeft = document.createElement('div');
  clientLeft.id = "client";
  clientLeft.innerHTML = name + ' has left!';
  infoTag.appendChild(clientLeft);
}

window.onload = function() {
  console.log('Connected');

  var server = io.connect('http://172.16.23.245:3000');

  // Get the nickname
  var nick = '';
  while (nick === '') {
    nick = prompt('To join the conversation enter your nickname: ');
  }

  // send the sever a new   message
  var send = document.getElementById('submit');
  send.addEventListener('click', function(event) {
    var message = document.getElementById('inputMessage').value;
    server.emit('message', {
      messager : nick,
      message : message
    });
  });

  // manages focus on the input section
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

  // the server acknowledged the message
  server.on('messageAck', function(data) {
    addMessage(data);
    var inputObj = document.getElementById('inputMessage');
    inputObj.value = '';
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

