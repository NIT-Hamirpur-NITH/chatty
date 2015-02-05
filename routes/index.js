var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('start', { title: 'Chatty : Start' });
});

router.post('/chat', function(req, res, next) {
  res.render('index', {
    title: 'Chatty : Chat',
    nickname : req.body.nick,
    room : req.body.room
  });
});

module.exports = router;
