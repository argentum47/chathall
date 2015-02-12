var io = require('socket.io')();

// io.on('connection', function(socket) {
//   console.log('user connected');
//   socket.on('new_user', function(user) {
//     console.log(user)
//   });
// });

var chat = io.of('/php').on('connection', function(socket) {
  console.log("user joined php room");
  chat.on('new_user', function(data) {
    console.log(data);
  });
});

module.exports = io
