var express = require('express');
var router = express.Router();
var multer = require('multer');
var User = require('../models/User');
var Campaign = require('../models/Campaign');
var Account = require('../models/Account');
var Donate = require('../models/Donate');
var flash = require('express-flash');
var upload = multer({
  dest: 'public/images/uploads'
});

var auth = function(req, res, next) {
  if (req.session.user) {
    return next();
  } else{
    req.flash('warn','You need to signin');
    console.log('request path',req.path);
    req.flash('forward', req.path);
    res.redirect('/signup');
    }
};

/* GET home page. */
router.get( '/', function(req, res, next) {
  res.render( 'index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('commons/signup', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  var user = new User();
  var account = new Account();
  user.name = req.body.name;
  user.phone = req.body.phone;
  user.id = req.body.id;
  user.email = req.body.email;
  user.password = req.body.password;
  user.role = req.body.role;
  user.save(function (err, rtn) {
    if(err) throw err;
    account.user = rtn._id;
    account.balance.credit = 0;
    account.balance.reserved = 0;
    account.save(function (err2,rtn2) {
      if(err2) throw err2;
      console.log(rtn2);
    });
    res.redirect('/signup');
  });
});

router.post('/signin', function(req, res, next) {
  User.findOne({$or: [{ email: req.body.emailIn }, { id: req.body.emailIn }]}, function (err,user) {
    if(err) throw err;
    console.log('call it',user);
    if( user == null || !User.compare( req.body.passwordIn, user.password )) {
      req.flash( 'warn', 'Email not exists or password not matched!!' );
      res.redirect('/signup');
    }else{
        var user_cookie = {name:user.name,id:user._id};
        res.cookie('user_cookie', user_cookie);
        req.session.user = { name: user.name, email: user.emailIn, id: user._id };
          res.redirect((req.body.forward)? req.body.forward : '/');

    }

  });
});

router.post('/signup/duplicate', function(req, res, next) {
  User.findOne({id:req.body.id},function (err, rtn) {
    if(err) throw err;
    if(rtn != null) res.json({ status: false, msg: 'Duplicate user id!!!' });
    else res.json({ status: true });
  });
});

router.get('/mypage',auth, function(req, res, next) {
  console.log(req.cookies.user_cookie.id);
  var user_idx = req.cookies.user_cookie.id
  User.findById({_id:user_idx},function(err1,rtn1){
    if(err1) throw err1;
    Campaign.find({insertedBy:req.cookies.user_cookie.id}, function(err, rtn) {
      if (err) throw err;
        Donate.findOne({donor_id:rtn1._id},function(err2,rtn2){
          if(err2) throw err2;
          console.log('aqaqaq',rtn2);
          res.render('commons/mypage', { title: 'My Page', result:rtn, user : rtn1, donate : rtn2});
        });
      });
  });
});

router.get('/profile/:id', function(req, res, next) {
  User.findOne({_id:req.params.id}, function(err, rtn) {
    if (err) throw err;
    res.render('commons/profile',{user:rtn});
    console.log(rtn.name);
  });
});

router.post('/profile', upload.single('uploadImg'), function(req, res, next) {
    var update = {
    proUrl : '/images/uploads/' + req.file.filename,
    title : req.body.name,
    phone: req.body.phone,
    address_region : req.body.region,
    address_city : req.body.city,
    address_other : req.body.address,
  };
  console.log('updata data', update);
    User.findByIdAndUpdate(req.body.user_ids, {$set: update}, function(err, rtn) {
      if(err) throw (err);
      res.redirect('/mypage');
    });
  });

  router.get('/signout',function (req,res) {
    req.session.destroy();
    res.redirect('/');
  });

module.exports = router;
