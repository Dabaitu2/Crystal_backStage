var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');
var crypto = require('crypto');


router.post('/',function(req,res,next){
  console.log("有人想登陆");
	var Md5 = crypto.createHash('md5');
	var userPassword = Md5.update(req.body.userPassword).digest('base64');
	console.log("用户名:"+ req.body.userId);
	//把用户名密码进行对比验证
	var user = model.user;
	console.log("获取到登录请求");
	user.findOne({userId:req.body.userId},function(error,doc){
		console.log(doc);
		if(doc === null){
			res.status(404).send({answer:'failed'});
		}else if(userPassword !== doc.userPassword){
			res.status(404).send({answer:'failed: wrong info'});
		}else{
		  req.session.userType = doc.userType;
			req.session.user = req.body.userId;
			req.session.address = doc.address;
			req.session.publicKey = doc.publicKey;
			req.session.tips = "hi";
			console.log("用户"+req.session.user+"上线啦");

      res.status(200).send({answer:'success'});
    }
	});
});

router.get('/',function (req, res, next) {
  console.log("获取消息!");
  res.status(200).json({answer:"login"});
});

module.exports = router;
