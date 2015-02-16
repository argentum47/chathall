var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

var routes = require('./routes/index');
var users = require('./routes/users');
var rooms = require('./routes/rooms');
app.set('port', 8000);

server.listen(app.get('port'), function() {
  console.log("Boo");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/rooms', rooms);

app.get('/index', function(req, res, next) {
  res.render("index");
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var usernames = [];

function findClientsSocket(roomId, namespace) {
  var res = []
  , ns = io.of(namespace ||"/");

  if (ns) {
    for (var id in ns.connected) {
      if(roomId) {
        var index = ns.connected[id].rooms.indexOf(roomId) ;
        if(index !== -1) {
          res.push(ns.connected[id]);
        }
      } else {
        res.push(ns.connected[id]);
      }
    }
  }
  return res;
}

var chat = io.of('/rooms').on('connection', function(socket) {

  socket.emit('pong', "connected")
  socket.on('ping', function(data) {
    console.log(data)
  });

  socket.on('load', function(data) {
    var room = findClientsSocket(io, data.room, '/rooms')
    console.log(data, usernames)
    if(data.username) {
      if(usernames.indexOf(data.username) === -1) {
        socket.username = data.username
        socket.room = data.room
        socket.active = true;
        socket.join(data.room)
        usernames.push(socket.username)
        socket.emit('log_message', { success: true })
        }
    }

    chat.in(data.room).emit('peopleInChat', {
      boolean: true,
      roomId: data.room,
      users: usernames
    });
  });

  socket.on('login', function(data) {
    var room = findClientsSocket(io, data.room, '/rooms')
    if(usernames.indexOf(data.username) === -1) {
      socket.emit('log_message', { success: false, message: 'user name exists'})
    } else {
      socket.username = data.username
      //socket.updated_at = data.id
      socket.room = data.room
      socket.active = true

      socket.join(data.room);

      if(room.length >= 0) {
        usernames.push(socket.username);
        console.log(usernames);
        socket.emit('log_message', { success: true })
      }

      chat.in(data.room).emit('peoplInChat', {
        boolean: true,
        roomId: data.room,
        users: usernames
      });
    }
  });

  socket.on('disconnect', function() {
    usernames.splice(usernames.indexOf(this.username), 1)
    socket.broadcast.to(this.room).emit('leave', {
      room: this.room,
      user: this.username
    });
    socket.leave(socket.room)
  });

  socket.on('message', function(data){
    console.log(data, socket.room)
    socket.broadcast.to(socket.room).emit('receive', {
      content: data.content,
      user: data.user
    });
  });
});
