var express = require('express');
var router = express.Router();
var multer = require('multer');
var Campaign = require('../models/Campaign');
var Account = require('../models/Account');
var Donate = require('../models/Donate');
var Transition = require('../models/Transition');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var upload = multer({
  dest: 'public/images/uploads'
});
var auth = function(req, res, next) {
  if (req.session.user) {
    return next();
  } else{
    req.flash('warn','You need to signin');
    console.log('request path',req.path);
    req.flash('forward', '/campaign'+req.path);
    res.redirect('/signup');
    }
};
router.get('/add', auth, function(err, res, next) {
  res.render('campaign/campaign-add');
});

router.get('/detail/:id', function(req, res, next) {
  Campaign.findById({
    _id: req.params.id
  }, function(err, rtn) {
    if (err) throw err;
    if (!req.cookies.cart) {res.render('campaign/campaign-detail', {camp: rtn});}
    else{
      for (var j = 0; j < req.cookies.cart.items.length; j++) {
        if (req.cookies.cart.items[j].id == rtn._id) {
          rtn.cart = true;
          break;
        }
      }
      res.render('campaign/campaign-detail', {camp: rtn});
    }

  });
});

router.get('/list', function(req, res, next) {
  Campaign.find({}, function(err, rtn) {
    if (err) throw err;
    if (req.cookies.cart) {
      console.log(req.cookies.cart);
      for (var i in rtn) {
        for (var j = 0; j < req.cookies.cart.items.length; j++) {
          if (req.cookies.cart.items[j].id == rtn[i]._id) {
            rtn[i].cart = true;
            break;
          }
        }
        console.log(typeof rtn[i]._id);
      }
    }

    res.render('campaign/campaign-list', {
      result: rtn
    });
    console.log(rtn);
  });

});

router.post('/add', upload.single('uploadImg'), function(req, res, next) {
  var campaign = new Campaign();
  campaign.title = req.body.campName;
  if (req.file) campaign.imgUrl = '/images/uploads/' + req.file.filename;
  campaign.brief = req.body.brief;
  campaign.story.text = req.body.text;
  campaign.story.html = req.body.contents;
  campaign.address.region = req.body.region;
  campaign.address.city = req.body.city;
  campaign.address.other = req.body.address;
  campaign.goal = req.body.goal;
  campaign.dueDate = req.body.endDate;
  campaign.tags = req.body.tags.split(",");
  campaign.status = "00";
  campaign.insertedBy = req.session.user.id;
  campaign.updatedBy = req.session.user._id;
  campaign.save(function(err, rtn) {
    if (err) throw err;
    res.json({
      status: true,
      msg: 'success',
      id: rtn._id
    });
  });
});

router.get('/view/:id', function(req, res, next) {
  Campaign.findOne({
    _id: req.params.id
  }, function(err, rtn) {
    if (err) throw err;
    if (rtn) {
      res.render('campaign/campaign-confirm', {
        camp: rtn
      });
    } else {
      throw new Error('Data not found!');
    }
  });
});

router.post('/view/:id', function(req, res, next) {
  Campaign.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (err) res.json(500, {
      'err': err.message
    });
    else res.json({
      users: user
    });
  });
});

router.get('/modify/:id', function(req, res, next) {
  Campaign.findOne({_id:req.params.id}, function(err, rtn) {
    if(err) throw err;
    if (rtn) {
      res.render('campaign/campaign-modify', {camp:rtn});
    }else{
      throw new Error('Data not found!');
    }
  });
});

router.post('/modify', upload.single('uploadImg'), function(req, res, next) {
    var update = {
    title : req.body.campName,
    imgUrl : '/images/uploads/' + req.file.filename,
    brief : req.body.brief,
    story_text : req.body.text,
    story_html : req.body.contents,
    address_region : req.body.region,
    address_city : req.body.city,
    address_other : req.body.address,
    goal : req.body.goal,
    dueDate : req.body.endDate,
    tags : req.body.tags,
    updated: new Date()
  };
    Campaign.findByIdAndUpdate(req.body.cam_id, {$set: update}, function(err, campaign) {
      if(err) throw (err);
      res.json({
        status: true,
        msg: 'success',
        id: campaign._id
      });
    });
  });


router.post('/detail', upload.single('uploadImg'), function(req, res, next) {
  var campaign = new Campaign();
    campaign.title = req.body.campName;
    if (req.file) campaign.imgUrl = '/images/uploads/' + req.file.filename;
    campaign.brief = req.body.brief;
    campaign.story.text = req.body.text;
    campaign.story.html = req.body.contents;
    campaign.address.region = req.body.region;
    campaign.address.city = req.body.city;
    campaign.address.other = req.body.address;
    campaign.goal = req.body.goal;
    campaign.dueDate = req.body.endDate;
    campaign.tags = req.body.tags;
    campaign.status = "00";

    campaign.save(function(err, rtn) {
      if(err) throw err;
      res.json({
        status: true,
        msg: 'success',
        id: rtn._id
      });
    });
  });


router.get('/delete/:id', function(req, res, next){
  Campaign.findByIdAndRemove(req.params.id, function(err, campaign){
    if(err) throw err;
    res.redirect('/campaign/list');
  });
});

router.get('/cart', function(req, res, next) {
  console.log(req.cookies.cart);
  if (!req.cookies.cart) {res.render('campaign/cart', {
    itemdata: []
  });}else{
  console.log('start');
  var keys = [];
  var amounts = [];
  for (var y in req.cookies.cart.items) {
    console.log(y);
    keys.push(req.cookies.cart.items[y].id);
    amounts.push(req.cookies.cart.items[y].amount);
  }
  console.log(keys);
  console.log(amounts);
  Campaign.find({
    _id: {
      $in: keys
    }
  }, function(err, rtn) {
    if (err) throw err;
    res.render('campaign/cart', {
      itemdata: rtn,
      amounts : amounts
    });
    console.log(rtn);
  });
  console.log('Cookies: ', req.cookies.cart.items);
  }
});


router.post('/addcart', function(req, res, next) {
  console.log('start');
  var items = req.cookies.cart;
  console.log(typeof items, items);
  if (!items) items = {
    items: []
  };
  console.log(items);
  items.items.push({
    id: req.body.id,
    amount: req.body.amount
  });
  console.log(req.body.id, req.body.amount);
  console.log(items);
  res.cookie('cart', items);
  //console.log(res.cookie('cart'));
  res.json({
    status: true,
    msg: 'success',
  });
});

router.post('/checkuser',function (req,res, next) {

  var link;
  if (req.session.user) {
    Account.find({user:req.session.user.id},function (err,rtn) {
      if(err) throw err;
      var total_amt = Number(req.body.total);
      res.cookie('total_amt', total_amt);
      if(rtn[0].balance.credit >= Number(req.body.total)){
        console.log('if work');
        link = '/campaign/checkout';
      }else {
        console.log('else work');
        link = '/campaign/buypoint';
      }
      res.json({
        status: true,
        msg: 'success',
        link: link,
      });
    });
  }else {
    link = '/signup';
    res.json({
      status: true,
      msg: 'success',
      link: link,
    });
  }
});

router.get('/remove/:id', function(req, res, next) {
  console.log(req.cookies.cart);

  for (var i = 0; i < req.cookies.cart.items.length; i++) {
    console.log('do ', req.cookies.cart.items[i].id, req.params.id);
    if (req.cookies.cart.items[i].id == req.params.id) {
      console.log('remove id', req.cookies.cart.items[i].id);
      req.cookies.cart.items.splice(i, 1);
    }
  }
  var items = req.cookies.cart;
  res.cookie('cart', items);
  res.redirect('/campaign/cart');
});

router.get('/checkout', function(req, res, next) {
  if (!req.cookies.cart) {res.render('campaign/checkout', {
    itemdata: []
  });}else{
  console.log('start');
  var keys = [];
  var amounts = [];
  for (var y in req.cookies.cart.items) {
    console.log(y);
    keys.push(req.cookies.cart.items[y].id);
    amounts.push(req.cookies.cart.items[y].amount);
  }
  console.log(keys);
  console.log(amounts);
  Campaign.find({
    _id: {
      $in: keys
    }
  }, function(err, rtn) {
    if (err) throw err;
    res.render('campaign/checkout', {
      itemdata: rtn,
      amounts : amounts
    });
    console.log(rtn);
  });
  console.log('Cookies: ', req.cookies.cart.items);
  }
});

router.get('/buypoint',auth, function(req, res, next) {
  res.render('campaign/buypoint');
});
router.post('/buypoint',function (req,res,next) {
  var transition = new Transition();
  var donate = new Donate();
  console.log('aaaa',req.body,req.cookies.user_cookie);
  Account.findOne({user:req.cookies.user_cookie.id},function (err,rtn) {
    if(err) throw err;
    var account = rtn._id;
    transition.acc_id = rtn._id;
    transition.amount = req.body.trf_amt;
    transition.type = "Deposite";
    transition.bank_name = req.body.bank_name;
    transition.bank_accname = req.body.bank_accname;
    transition.save(function (err2,rtn2) {
      if(err2) throw err2;
      console.log('transition',rtn2);
      donate.amount.reserved = req.cookies.total_amt;
      donate.amount.total = req.cookies.total_amt;
      donate.trans_id = rtn2._id;
      donate.status = "reserved donation";
      donate.donor_id = req.cookies.user_cookie.id;
      donate.campaigns = [];
      for(var t in req.cookies.cart.items){
        donate.campaigns.push({
          cam_id: req.cookies.cart.items[t].id,
          amount: req.cookies.cart.items[t].amount
        });
        }
      donate.save(function (err3,rtn3) {
        if(err3) throw err3;
        console.log('donation',rtn3);
          Transition.findByIdAndUpdate({_id:rtn3.trans_id},{$set:{_id:rtn3.trans_id,donate_id:rtn3._id}},{new: true},function (err5,rtn5) {
            if(err5) throw err5;
            console.log('SUCCESSFULLY CHANGE',rtn5);
            res.clearCookie('cart').redirect('/campaign/list');
          });
      });
    });

  });

});
  router.post('/search',(req,res)=>{
    Campaign.findById(req.body.camp_id, (err,rtn)=>{
      if(err)throw err;
      res.json({
        status: true,
        msg: 'success',
        camp: rtn,
      })
    })
  });
module.exports = router;
