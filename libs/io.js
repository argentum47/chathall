var io = require('socket.io')();

io.on('connection', function(sock) {
  console.log('user connected');
  sock.on('new_user', function(user) {
    console.log(user)
  });
});


module.exports = io
