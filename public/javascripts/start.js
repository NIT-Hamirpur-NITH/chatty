function message(text) {
  var info = document.getElementById('info');
  info.innerHTML = text;
}

window.onload = function() {

  var server = io.connect('http://172.16.16.145:3000');

  var form = document.getElementById('form');
  var enter = document.getElementById('enter');
  enter.addEventListener('click', function(event) {
    console.log('Submit form');

    event.preventDefault();

    var room = document.getElementById('room');
    var nickname = document.getElementById('nickname');

    if(room.value == "") {
      message("Please enter a room name");
      return;
    }

    if(nickname.value == "") {
      message("Please enter a nick name");
      return;
    }

    server.emit('check', {
      'room' : room.value,
      'nick' : nickname.value
    });

    server.on('checked', function(data) {
      console.log(data);
      if(!data.prevent) {
        form.submit()
      } else {
        message(data.message);
      }
    });

  });

};

