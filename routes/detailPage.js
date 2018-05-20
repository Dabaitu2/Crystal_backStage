/**
 *    Created by tomokokawase
 *    On 2018/1/19
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');

router.get('/', function(req,res,next){
  console.log("收到查看项目请求");
  //需登陆才能查看
  if(req.session.user){
    if(req.query.id!==undefined) {
      var project = model.project;
      project.find({projectID:req.query.id},function(err,doc) {
        if(err){
          res.status(500).json({answer:'failed',data:[]});
        } else {
          console.log(doc);
          res.status(200).json({answer:'success',data:doc});
        }
      })
      // res.status(200).send('success');
    } else {
      res.status(404).json({answer:'failed',data:[]});
    }
  } else {
    res.status(404).json({answer:'failed',data:[]});
  }

});

module.exports = router;
