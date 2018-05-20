/**
 *    Created by tomokokawase
 *    On 2018/2/17
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');


router.post('/',function(req,res,next){
  console.log("hi!");
  if(req.session.user) {
    console.log("---收到ID为" + req.session.user + "发来的添加评论请求");
    var user = model.user;
    var flag = false;
    user.find({userId: req.session.user},function (err,doc) {
      if(err){
        res.status(404).send("something wrong");
      } else {
        console.log(doc);
        var userProject = doc[0].userProject;
        console.log(userProject);
        for (var i=0;i<userProject.length; i++){
          if(userProject[i]===req.body.projectId){
            flag = true;
            break;
          }
        }
        if(flag === true) {
          var review = model.review;
          review.create({
            ProjectId: req.body.projectId,
            floor: req.body.floor,
            reviewer: req.session.user,
            detail: req.body.detail,
            reviewDate: req.body.reviewDate
          }, function (err, doc) {
            if (err) {
              console.log(err);
              res.status(404).json({answer:"failed! 02"});
            } else {
              res.status(200).json({answer:"success",data:doc});
            }
          });
        } else {
          res.status(404).json({answer:"failed! 03"});
        }
      }
    });

  } else {
    res.status(404).json({answer:"invalid"});
  }
});

router.get("/",function (req,res,next) {
  if(req.session.user) {
    console.log("---收到ID为" + req.session.user + "发来的查看评论请求");
          var review = model.review;
          review.find({
            ProjectId: req.query.projectId,
          }, function (err, doc) {
            if (err) {
              console.log(err);
              res.status(404).json({answer:"failed! 02",data:[]});
            } else {
              console.log(doc);
              res.status(200).json({answer:"success",data:doc});
            }
          });
  } else {
    res.status(404).send("invalid");
  }
});


module.exports = router;
