var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');
var trade = require('../block/trade');
var tradeModel = model.trade;
var getBlock = require('../block/getBlock');






router.post('/',function(req,res,next){
  console.log("收到发起交易请求");
	if(req.session.user){
	  console.log(req.body);
	  console.log("交易开始");
	  try {
      trade(res, req, req.body.starter, req.body.challenge, req.body.receiver, req.body.projectId, reback, errback);
    }catch (e){
	    console.log(e);
    }
	} else {
	  res.status(404).json({answer:"failed"});;
  }
});

function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

function reback(res,id,projectId,proData){
  var user = model.user;
  var trade = model.trade;
  user.find({userId:id},function(err,doc,Data){
    var newFor = Number(doc[0].fortune) - proData.expenditure;
    var project = model.project;
    var newPro = doc[0].userProject;
    if(!contains(doc[0].userProject,projectId)){
      newPro = doc[0].userProject.push(projectId);
    }
    console.log(doc[0].userProject);
    user.update({userId:id},{$set:{fortune:newFor,userProject:doc[0].userProject}},function(err,doc){
      console.log(doc);
    });
    project.find({projectID:projectId},function(err,doc){
      if(err){
        console.log("没找到项目:"+err);
      }
      console.log("项目ID：" +projectId);
      var projectFortune = parseInt(doc[0].projectFortune) + parseInt(proData.expenditure);
      console.log(projectFortune);
      console.log(doc[0].projectFortune);
      console.log(proData.expenditure);
      var projectParticipated = parseInt(doc[0].projectParticipated) + 1;
      var projectProgress = Math.round(projectFortune/parseInt(doc[0].projectTarget)*100);
      var projectStarter = doc[0].projectStarter;
      project.update({projectID:projectId},{$set:{
        projectFortune:projectFortune,
        projectParticipated:projectParticipated,
        projectcompleted:projectProgress
      }},function(err,doc){
        if(err){
          console.log(err);
          res.status(500).json({answer:"failed"});
        }else{
          trade.create({
            starter: id,
            receiver: projectStarter,
            projectId: projectId,
            expenditure: parseInt(proData.expenditure),
          },function (err,doc) {
            if(err){
              res.status(404).json({answer:"failed"});
            } else {
              res.status(200).json({answer:"success"});
            }
          })
        }
      });
    })
  })
}

function errback(res) {
  console.log("emmm怎么我还在")
  res.status(404).send("no such password!");
}









module.exports = router;
