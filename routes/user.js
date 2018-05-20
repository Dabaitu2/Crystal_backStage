var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');


router.get('/',function(req,res,next){
  console.log(req.session);
	if(req.session.user){
		var userID = req.session.user;
		var user = model.user;
		user.findOne({userId:userID},function(err,doc){
			console.log(doc);
			if(err){
				console.log(err);
			}else{
				res.status(200).json({answer:"success",data:doc});
			}
		});
	}else{
    res.status(404).json({answer:"failed"});
	}
});

module.exports = router;
