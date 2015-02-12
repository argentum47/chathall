var express = require('express'),
    router  = express.Router();

var rooms =
    [{id:13,
      room :"java" },
     {id: 11,
      room: "php" },
     {id: 14,
      room: "react" },
     {id: 17,
      room:"js" },
     {id: 12,
      room: "go"},
     {id: 16,
      room: "php"},
     {id: 18,
      room: "ruby"},
     {id: 15,
      room: "emacs"}];

function getRoomName(id) {
  for(var r in rooms) {
    if(rooms[r].id == +id)
      return rooms[r].room
  }
}

router.get('/:id/:name', function(req, res,next) {
  //var room_name = getRoomName(req.params.id);
  res.render(getRoomName(req.params.id))
});

router.get('/', function(req, res, next) {
  res.send({ rooms: rooms });
});


module.exports = router
