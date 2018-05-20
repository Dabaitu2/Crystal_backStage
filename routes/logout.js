var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');
var crypto = require('crypto');


router.get('/',function(req,res,next){
  console.log("有人想退出登陆");
  delete req.session.user;
  res.status(200).json({answer:"success"});
});

module.exports = router;
