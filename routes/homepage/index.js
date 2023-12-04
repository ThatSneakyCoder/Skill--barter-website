var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../../api/authMiddleware');

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  res.render('index');
});

module.exports = router;
