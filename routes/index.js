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

  User.findOne({$or: [{email: req.body.emailIn},{id: req.body.emailIn}]} ,function (err,user) {
    if(err) throw err;
    console.log('call it',user);
    if(user == null || !User.compare(req.body.passwordIn, user.password)){
      req.flash('warn', 'Email not exists or password not matched!!');
      res.redirect('/signup');
    }else {
      req.session.user = { name: user.name, email: user.email };
        res.redirect((req.body.forward)? req.body.forward : '/');
      }
      // res.redirect();

  });

});
router.post('/signup/duplicate', function(req, res, next) {
  User.findOne({id:req.body.id},function (err, rtn) {
    if(err) throw err;
    if(rtn != null) res.json({ status: false, msg: 'Duplicate user id!!!'});
    else res.json({ status: true});
  });
});


module.exports = router;
