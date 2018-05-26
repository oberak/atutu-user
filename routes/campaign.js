var express = require('express');
var router = express.Router();
//TODO must finish page
router.get('/add', function(req, res, next) {
  res.render('campaign/campaign-add', { title: 'Express' });
});

module.exports = router;
