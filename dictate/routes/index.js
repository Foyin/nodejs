var express = require('express');
var router = express.Router();
//var annyang = require('annyang.min.js');
var state = [];

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Simple demo' });
});

router.post('/add', function(req, res) {	
    var obj = { txt: req.body.txt };
    state.push(obj);
    res.render('add', { title: 'What you said:', item: obj });
});

router.get('/list', function(req, res) {
    res.render('list', { title: 'People Listing',  items: state});
});


// Start listening.
//annyang.start();
module.exports = router;
