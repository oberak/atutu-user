var express = require('express');
var router = express.Router();
var multer = require('multer');
var Campaign = require('../models/Campaign');
var upload = multer({
  dest: 'public/images/uploads'
});
var auth = function(req, res, next) {
  if (req.session.user){
    return next();
  } else
     res.redirect('/signup');
};
router.get('/add', auth, function (err,res,next) {
    res.render('campaign/campaign-add');
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
  campaign.tags = req.body.tags;
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

router.get('/view/:id', function (req,res,next) {
  Campaign.findOne({_id:req.params.id},function (err,rtn) {
    if(err) throw err;
    if(rtn){
      res.render('campaign/campaign-confirm',{camp:rtn});
    }else{
      throw new Error('Data not found!');
    }
  });
});

router.post('/view/:id', function(req, res, next) {
  Campaign.findOne({_id:req.params.id}, function(err, user) {
    if(err) res.json(500, {'err': err.message});
    else res.json({ users: user});
  });
});

router.get('/modify/:id', function(req, res, next) {
  Campaign.findOne({_id:req.params.id}, function(err, rtn) {
    // if(err) throw err;
    // if (rtn) {
      res.render('campaign/campaign-modify', {camp:rtn});
    // }else{
    //   throw new Error('Data not found!');
    // }
  });
});

router.post('/modify', upload.single('photo'), function(req, res, next) {
  Campaign.findById(req.body.id, function(err, rtn) {
    var campaign = new Campaign();
    campaign.updated = new Date();
    if(err) throw err;
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

    campaign.save(function(err, rtn) {
    if (err) throw err;
      res.redirect('/campaign/confirm/' + rtn._id);
    });
  });
});

router.get('/delete/:id', function(req, res, next) {
  Campaign.findById(req.params.id, function(err, campaign){
    campaign.updated = new Date();
    campaign.isDeleted = true;
    campaign.save({_id:campaign.id }, function(err) {
      if(err) throw err;
      res.redirect('/campaign/add');
    });
  });
});


module.exports = router;
