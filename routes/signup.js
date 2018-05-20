var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');
var crypto = require('crypto');
var getBlock = require('../block/getBlock')


router.post('/',function(req,res,next) {
  console.log("---收到ID为"+req.body.userId+"发来的注册请求");

  var Md5 = crypto.createHash('md5');
	var passWord = Md5.update(req.body.userPassword).digest('base64');
	var user = model.user;

	user.findOne({userId:req.body.userId},function(err,doc){
	  if (req.body.userType === 1 && (req.body.verifyNum ===" "||req.body.verifyAddress ===" ")) {
      console.log("注册申请失败!");
      res.status(404).json({answer:'failed signup: inadequate info'});
    }
		if (doc === null){
			user.create({
        userId:  req.body.userId,
        userPassword:passWord,
        userName: req.body.userName,
        userType: req.body.userType,
        verifyNum: req.body.verifyNum,
        verifyAddress: req.body.verifyAddress,
        fortune: 100,
        userProject: [],
        projectInitiate:0
			},function(err,doc) {
				if(err) {
				  console.log(err);
					res.sendStatus(500);
				}else {
          var pw = undefined;
          console.log("用户注册校验成功,开始分配区块");
          getBlock(pw,req.body.userId,res);

				}
			});
		}else {
		  console.log("注册申请失败!");
			res.status(404).send({answer:'failed signup'});
		}
	});
});


module.exports = router;
