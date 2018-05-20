/**
 *    Created by tomokokawase
 *    On 2018/4/24
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model    = require('../common/model');
var crypto   = require('crypto');
var forge    = require('node-forge');







router.post('/',function(req,res,next) {
  console.log("---收到ID为"+req.body.userId+"发来的注册请求");

  var Md5 = crypto.createHash('md5');
  var passWord = Md5.update(req.body.userPassword).digest('base64');
  var user = model.user;



  // 创建公私钥
  var rsa = forge.pki.rsa;
  var keypair = rsa.generateKeyPair({bits: 256, e: 0x10001});
  var privatekey = keypair.privateKey;
  var publickey = keypair.publicKey;
  // 转化为pem格式
  var pem_privatekey = forge.pki.privateKeyToPem(privatekey);
  var pem_publickey = forge.pki.publicKeyToPem(publickey);
  // 制造地址
  var sha256 = crypto.createHash('sha256');
  var address = "0x"+sha256.update(pem_publickey).digest('hex');


  user.findOne({userId:req.body.userId},function(err,doc){
    if (req.body.userType === 1 && (req.body.verifyNum ===" "||req.body.verifyAddress ===" ")) {
      console.log("注册申请失败! inadequate info");
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
        projectInitiate:0,
        address: address,
        publicKey: pem_publickey
      },function(err,doc) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.status(200).json({
            answer:'success',
            address: address,
            privateKey: pem_privatekey
          });
        }
      });
    }else {
      console.log("注册申请失败!已经有此用户名");
      res.status(404).json({answer:'failed signup'});
    }
  });
});


module.exports = router;
