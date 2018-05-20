var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');

router.get('/',function(req,res,next){
	if(req.session.user){
		var project = model.project;
		project.find({},function(err,doc){
		  //太多了，应该按需加载

			res.status(200).json({data:doc, answer:"success"});
		});
	} else {
	  res.status(404).json({answer:"need login", data:[]});
  }
});

module.exports = router;
