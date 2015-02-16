var socket = io.connect('/rooms', { port: 8000, transports: ['websocket']});

function getRoomId() {
  return window.location.pathname.match(/\/rooms\/(\d+)$/)[1]
}

function checkLoginStatus(name) {
  var foo = sessionStorage.getItem("user");
  if(foo) {
    return name == JSON.parse(foo).username ? name : JSON.parse(foo).username
  }
  return false;
}

(function() {
  var username = checkLoginStatus();
  if(username) {
    $(".loginForm").style.display="none";
    $(".chatWindow").style.display="block";
  }
  socket.on('connect', function(data) {
    socket.emit('load', {
      username: username || $(".username").value,
      room: getRoomId()
    });
  });

})()

socket.on('peopleInChat', function(data){
  console.log(data);
});

socket.on('leave', function(data) {
  console.log(data, "left");
});

$("#login").onclick = function(e) {
  e.preventDefault();
  var formData = {};
  formData["username"] = $(".username").value;
  formData["uid"] = Date.now();
  formData["room"] = getRoomId()

  sessionStorage.setItem("user", JSON.stringify(formData))
  socket.emit("login", formData)

  socket.on('log_message', function(data) {
    if(data.success) {
      $(".loginForm").style.display="none";
      $(".chatWindow").style.display="block";
      if(data.messages) {
        $(".logs").innerHTML = data.message
      }
    }
  });

  socket.on('startChat', function(data) {
    console.log(data);
  });

  return false;
}

$("#sendMessage").onclick = function(e) {
  e.preventDefault();
  var messageData = {};
  messageData["content"] = $(".content").value
  messageData["user"] = checkLoginStatus()

  socket.emit('message', messageData);
}

socket.on('receive', function(data) {
  console.log(data)
})
