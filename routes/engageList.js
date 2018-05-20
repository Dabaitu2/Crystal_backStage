/**
 *    Created by tomokokawase
 *    On 2018/2/13
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var model = require('../common/model');

router.get('/', function(req, res, next) {
  if(req.session.user){
    console.log("getUserRequest");
    var user = model.user;
    var project = model.project;
    user.find({userId:req.session.user},function(err,doc){
      if(err){
        res.status(200).send("got error");
      }
      var len = doc[0].userProject.length;
      console.log(doc);
      var projectList = [];

      //Promise 真的好用

      var data = doc[0].userProject;
      var TaskList = [];
      var count = 0;
      var successFlag = true;
      for(var i=0; i<len; i++){
        TaskList.push(new Promise(function (resolve,reject) {
          project.find({projectID: data[count++]}, function (err, doc) {
            if(err){
              console.log(err);
              // 有错就reject
              reject("task failed");
              successFlag = false;
            } else {
              console.log("task "+count+" finished!");
              console.log(data[count]);
              console.log(doc[0]);
              projectList.push(doc[0]);
              // count++;
              // 无措就resolve
              resolve("task finished");
            }
          });
        }));
      }

      Promise.all(TaskList).then(function () {
        if(successFlag = true){
          res.status(200).json({data:projectList, answer:"success"});
        } else {
          console.log("count= "+count);
          res.status(404).json({data:[], answer:"data error"});
        }
      })
    });
  } else {
    res.status(404).json({answer:"need login",data:[]});
  }
});
module.exports = router;








