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
router.get('/view', function(req, res, next) {
  res.render('campaign/campaign-view');
});

router.get('/list', function(req, res, next) {
  res.render('campaign/campaign-list');
});

router.post('/add', upload.single('uploadImg'), function(req, res, next) {
  var campaign = new Campaign();
  campaign.title = req.body.campName;
  if (req.file) campaign.imgUrl = '/images/uploads/' + req.file.filename;
  campaign.brief = req.body.brief;
  campaign.story = req.body.contents;
  campaign.address.region = req.body.region;
  campaign.address.city = req.body.city;
  campaign.address.other = req.body.address;
  campaign.goal = req.body.goal;
  campaign.dueDate = req.body.endDate;
  campaign.tags = req.body.tags;
  campaign.creator = req.session.user._id;
  campaign.updatedBy = req.session.user._id;
  campaign.save(function(err, rtn) {
    if (err) throw err;

    console.log(rtn);
  });
  res.json({
    status: true,
    msg: 'success'
  });
});
module.exports = router;
