const express = require('express');
const router = express.Router();
// const calil = require('../module/calil');

/* GET home page. */
// router.get('/list', function(req, res, next) {
//   console.log('list!');
//   res.render('index', { title: 'Express' });
// });
router.get('/', function(req, res, next) {
  // const result = calil.library('石川', '', '', '');
  res.render('result', {
    ibsn: '1234'
  });
});

module.exports = router;
