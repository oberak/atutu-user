var express = require('express');
var router = express.Router();
//TODO must finish page
router.get('/add', function(req, res, next) {
  res.render('campaign/campaign-add');
});

router.get('/view', function(req, res, next) {
  res.render('campaign/campaign-view');
});

router.get('/list', function(req, res, next) {
  res.render('campaign/campaign-list');
});

module.exports = router;
