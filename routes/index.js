var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup', function(req, res, next) {
  res.render('commons/signup', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  var user = new User();
  user.name = req.body.name;
  user.phone = req.body.phone;
  user.id = req.body.id;
  user.email = req.body.email;
  user.password = req.body.password;
  user.role = req.body.role;
  user.save(function (err, rtn) {
    if(err) throw err;
    console.log('save successful', rtn);
    res.redirect('/signup');
  });
});

router.post('/signin', function(req, res, next) {

  User.findOne({$or: [{email: req.body.email},{id: req.body.email}]} ,function (err,user) {
    if(err) throw err;
    console.log('call it',user);
    if(user == null || !User.compare(req.body.password, user.password)){
      res.redirect('/signup');
    }else {
      res.redirect('/');
    }
  });

});

module.exports = router;
