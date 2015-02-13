var io = require('socket.io')();

io.of('/rooms').on('connection', function(socket) {
  console.log("user joined php room");
  socket.emit('pong', { number: 0})
  socket.on('ping', function(data) {
    console.log(data)
    socket.nickname = data.nickname
    socket.room = data.room_id

    socket.join(data.room_id)

  });
});

module.exports = io
