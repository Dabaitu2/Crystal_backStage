/**
 *    Created by tomokokawase
 *    On 2018/2/2
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');

router.get('/',function(req,res,next){
  console.log("收到获取用户project请求");
  //需登陆才能查看
  if(req.session.user){
    var user    = model.project;
    user.find({projectInitiate:req.session.user},function (err,doc) {
      if(err){
        res.status(404).send('failed');
      } else {
        res.status(200).send(doc);
      }
    });
  } else {
    res.status(404).send('failed');
  }
});

module.exports = router;
