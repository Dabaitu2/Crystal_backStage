/**
 *    Created by tomokokawase
 *    On 2018/2/1
 *    阿弥陀佛，没有bug!
 */
/**
 *    Created by tomokokawase
 *    On 2018/1/19
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');

router.get('/',function(req,res,next){
  console.log("收到获取starter请求");
  //需登陆才能查看
  if(req.session.user){
    var user    = model.user;
    user.find({userId:req.session.user},function (err,doc) {
      if(err){
        res.status(404).json({answer:'failed'});
      } else {
        res.status(200).json({answer:"success",data:doc});
      }
    });
  } else {
      res.status(404).json({answer:'failed'});
  }
});

module.exports = router;
