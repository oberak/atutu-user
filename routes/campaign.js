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

router.get('/detail/:id', function (req,res,next) {
  Campaign.findById({_id:req.params.id},function (err,rtn) {
    if(err) throw err;
    console.log(rtn);
    if(rtn)
    res.render('campaign/campaign-detail',{camp:rtn});
  });
});

router.get('/list', function(req, res, next) {
  Campaign.find({},function (err,rtn) {
    if (err) throw err;
    res.render('campaign/campaign-list',{result: rtn});
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
  Campaign.findById({_id:req.params.id},function (err,rtn) {
    if(err) throw err;
    console.log(rtn);
    if(rtn)
    res.render('campaign/campaign-confirm',{camp:rtn});
  });
});
module.exports = router;
