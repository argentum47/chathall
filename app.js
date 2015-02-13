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


io.of('/rooms').on('connection', function(socket) {
  socket.join('/')
  console.log("user joined php room");
  socket.emit('pong', { number: 0})
  socket.on('ping', function(data) {
    console.log(data)
    socket.nickname = data.nickname
    socket.room = data.room_id
    //socket.join(data.room_id)

  });
});
