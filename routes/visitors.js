var express = require('express');
var router = express.Router();

router.post('/visit', function (req, res) {
  res.send('respond with a resource');
});

module.exports = router;
