/**
 *    Created by tomokokawase
 *    On 2018/3/2
 *    阿弥陀佛，没有bug!
 */
/**
 *    Created by tomokokawase
 *    On 2018/2/1
 *    阿弥陀佛，没有bug!
 */
/**
 *    Created by tomokokawase
 *    On 2018/1/19
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');
var blockmodel = require('../block/model');
var crypto = require('crypto')
var getBlock = require('../block/getBlock')
var forge    = require('node-forge');
var rsa = forge.pki.rsa;


router.post('/',function(req,res,next){
  console.log("收到充值请求");
  //需登陆才能查看
  if(req.session.user){
    var user    = model.user;
    user.findOne({userId:req.session.user},function(error,doc){
      console.log(doc);
      if(doc === null){
        res.status(404).send('failed login');
      }else{
        user.update({userId:req.session.user},{$inc:{fortune: req.body.expenditure} },function (err,doc) {
          if(err){
            console.log("something wrong 01");
            res.status(404).json({data:'failed: no such user'});
            return null;
          } else {
            updateBlock(req, res);
          }
        });
      }
    });

  } else {
    console.log("something wrong 00");
    res.status(404).json({data:'failed'});
  }
});


function reback(res, id, proData){
  var trade = model.trade;
  trade.create({
    starter: id,
    receiver: "Charge Funding",
    expenditure: parseInt(proData.expenditure),
    projectId: id,
  },function (err,doc) {
    if(err){
      console.log(err);
      res.status(404).json({answer:"failed"});
      return null;
    } else {
      res.status(200).json({answer:"success"});
    }
  });
}


function updateBlock(req, res) {
  var block = blockmodel.block;
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
          console.log("验证失败! 01");
          res.status(404).json({answer:"failed"});
          return;
        }
        if(true_one === req.body.challenge) {
              var trade = {
                describe: "Charge_funding",
                from: req.session.address,
                timeStamp: new Date().toUTCString(),
                amount: req.body.expenditure
              };
              console.log(trade);
              block.update({"index": ((len-1)+"")},{$push:{"data":trade}},{ multi: true },function (err) {
                if(err){
                  res.status(404).json({answer:'failed'});
                } else {
                  console.log("更新成功");
                  reback(res, req.session.user,req.body)
                }})
        } else {
          console.log("验证失败! 02");
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
            updateBlock(req, res);
          }).catch(function (err) {
          console.log(err);
          res.status(500).json({answer:"failed"});
          return null;
        });
      }
    }
  });
}

module.exports = router;
