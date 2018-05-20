/**
 *    Created by tomokokawase
 *    On 2018/2/16
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');

router.get('/',function(req,res,next){
  if(req.session.user){
    var project = model.project;
    project.find({ProjectID:req.body.projectID},function(err,doc){
      if(err){
        res.status(404).send("No resource");
      }
      console.log(doc)
      res.status(200).send(doc[0]);
    });
  } else {
    res.status(404).send("need login");
  }
});

module.exports = router;
