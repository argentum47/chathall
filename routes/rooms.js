var express = require('express'),
    router  = express.Router();

var rooms =
  [{
    room: "js",
    id: "17"
  },
   {
     room: "php",
     id: "11"
   },
   {
     room: "rails",
     id: "33"
   }];

router.get('/', function(req, res, next) {
  res.send({ rooms: rooms });
});

module.exports = router
