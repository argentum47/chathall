var express = require('express');
var router = express.Router();

/* GET users listing. */
var users =
    [{id: 1,
      room: [],
      name: "dhall0"},
     {id: 2,
      room: [],
      name: "dwallace1"},
     {id: 3,
      room: [],
      name: "jcunningham2"},
     {id: 4,
      room: [],
      name: "lwoods3"},
     {id: 5,
      room: [],
      name: "driley4"},
     {id: 6,
      room: [],
      name: "aromero5"},
     {id: 7,
      room: [],
      name: "rromero6"},
     {id: 8,
      room: [],
      name: "creed7"},
     {id: 9,
      room: [],
      name: "cwells8"},
     {id: 10,
      room: [],
      name: "tevans9"}]

router.get('/', function(req, res, next) {
  res.json({users: users});
});

router.get('/login', function(req, res, next) {
  res.render('login')
});

module.exports = router;
