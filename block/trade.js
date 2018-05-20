var mongoose = require('mongoose');
var model = require('./model');
var newModel = require('../common/model');
var crypto = require('crypto');
var forge    = require('node-forge');
var rsa = forge.pki.rsa;
var getBlock = require('../block/getBlock');




function getRandomPassword(){
	var text=['abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ','1234567890','~!@#$%^&*()_+";",./?<>'];
	var rand = function(min, max){return Math.floor(Math.max(min, Math.random() * (max+1)));}
	var len = rand(8, 16); // 长度为8-16
	var pw = '';
	for(var i=0; i<len; ++i)
	{
	var strpos = rand(0, 3);
	pw += text[strpos].charAt(rand(0, text[strpos].length));
	}
	return pw;
}

function trade(res,req,id,chanllenge,newId,projectId,callback,errback){
  var block = model.block;
	console.log("开始尝试交易");
	block.find({},function(err, doc){
	  var len = doc.length;
		for(var i = 0;i<len;i++){
      if(i===doc.length-1 && doc[i].data.length<10){
        console.log("找到符合条件的区块了");
        try {
          var pem_publickey = req.session.publicKey;
          var public_Key = forge.pki.publicKeyFromPem(pem_publickey);
          var true_one = forge.pki.rsa.decrypt(req.body.sign, public_Key, 32);
        } catch(err) {
          console.log("验证失败!");
          res.status(404).json({answer:"failed"});
          return;
        }
        if(true_one === chanllenge) {
          var user = newModel.user;
          user.findOne({userId:req.body.receiver}, function (err, new_doc) {
            if(err){
              res.status(404).json({answer:'failed'});
              return null;
            } else {
              var receiver = new_doc.userId;
              var trade = {
                describe: "trasaction",
                from: req.session.address,
                to: receiver,
                toAddress: new_doc.address ? new_doc.address : "0x4ead15ds52sdghsdxxz3fasxzcx",
                timeStamp: new Date().toUTCString(),
                amount: req.body.expenditure
              };
              console.log(trade);
              block.update({"index": ((len-1)+"")},{$push:{"data":trade}},{ multi: true },function (err) {
                if(err){
                  res.status(404).json({answer:'failed'});
                } else {
                  console.log("更新成功");
                  callback(res,id,projectId,req.body);
                }
              });
            }
          });

        } else {
          console.log("验证失败!");
          res.status(404).json({answer:"failed"});
          return;
        }
      } else if(i===doc.length-1 && doc[i].data.length===10){
        var pw = undefined;
        var wrapper = function (resolve, reject) {
          getBlock(pw,req.session.user,res, resolve, reject)
        };
        new Promise(wrapper)
          .then(function (result) {
            trade(res,req,id,chanllenge,newId,projectId,callback,errback)
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({answer:"failed"});
            return null;
        });
      }
		}
	});
}

module.exports = trade;
