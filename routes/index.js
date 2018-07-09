var express = require('express');
var router = express.Router();
var multer = require('multer');
var User = require('../models/User');
var Campaign = require('../models/Campaign');
var upload = multer({
  dest: 'public/images/uploads'
});

var auth = function(req, res, next) {
  if (req.session.user) {
    return next();
  } else{
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
  User.findOne({$or: [{ email: req.body.emailIn }, { id: req.body.emailIn }]}, function (err,user) {
    if(err) throw err;
    console.log('call it',user);
    if( user == null || !User.compare( req.body.passwordIn, user.password )) {
      req.flash( 'warn', 'Email not exists or password not matched!!' );
      res.redirect('/signup');
    }else {
      var user_cookie = {name:user.name,id:user._id};
      res.cookie('user_cookie',user_cookie);
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
  Campaign.find({insertedBy:req.cookies.user_cookie.id}, function(err, rtn) {
    if (err) throw err;
      res.render('commons/mypage', { title: 'My Page', result:rtn});

    });
});

router.get('/profile/:id', function(req, res, next) {
  User.findOne({_id:req.params.id}, function(err, rtn) {
    if (err) throw err;
    res.render('commons/profile',{data:rtn});
    console.log(rtn.name);
  });
});

router.post('/profile', upload.single('uploadImg'), function(req, res, next) {
    var update = {
    imgUrl : '/images/uploads/' + req.file.filename,
    title : req.body.name,
    phone: req.body.phone,
    address_region : req.body.region,
    address_city : req.body.city,
    address_other : req.body.address,
  };
    User.findByIdAndUpdate(req.body.cam_id, {$set: update}, function(err, rtn) {
      if(err) throw (err);
      res.redirect('/mypage');
    });
  });

module.exports = router;
