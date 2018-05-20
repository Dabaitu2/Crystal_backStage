/**
 *    Created by tomokokawase
 *    On 2018/2/17
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');


router.get('/',function(req,res,next){
  console.log("hi!");
  if(req.session.user) {
    console.log("---收到查看资金情况请求");
    var cashRoute = model.cashRoute;
    cashRoute.find({ProjectId:req.query.projectID}, function (err, doc) {
      if (err) {
        console.log(err);
        res.status(404).json({answer:"failed!"});
      } else {
        console.log(req.body);
        console.log(doc);
        res.status(200).json({answer:"success",data:doc});
      }
    });
  } else {
    res.status(404).json({answer:"invalid"});
  }
});

router.get("/",function (req,res,next) {
  console.log("get 到了!");
  res.send("hi!");
});


module.exports = router;
