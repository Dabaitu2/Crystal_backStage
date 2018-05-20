/**
 *    Created by tomokokawase
 *    On 2018/2/16
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../common/model');
var blockmodel = require('../block/model');
var getBlock = require('../block/getBlock')
var forge    = require('node-forge');
var rsa = forge.pki.rsa;


router.post('/',function(req,res,next){
  console.log("hi!");
  if(req.session.user && req.session.user === req.body.starter) {
    console.log("---收到ID为" + req.session.user + "发来的更新资金情况请求");
    var project = model.project;
    project.findOne({projectID: req.body.projectId},function (err, doc) {
      if(err) {
        res.status(404).json({answer:"failed!"});
        return null;
      } else {
        // 项目要众筹完毕才行
        if(doc.projectcompleted>100||doc.projectcompleted===100){
          // 统一社会信用代码
          var pattern = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g;
          if(req.body.receiverRegister.match(pattern)===null){
            res.status(404).json({answer:"cooperation wrong!"});
            return null;
          }
          console.log("核验通过，开始记录")
            var cashRoute = model.cashRoute;
            cashRoute.create({
            ProjectId: req.body.projectId,
            cost: req.body.cost,
            RouteDate: req.body.date,
            RouteName: req.body.RouteName,
            starter: req.body.starter,
            receiver: req.body.receiver,
            receiverProve: req.body.receiverProve,
            receiverRegister: req.body.receiverRegister,
            disc: req.body.disc,
          }, function (err, doc) {
            if (err) {
              console.log(err);
              res.status(404).json({answer:"failed!"});
            } else {
              updateBlock(req, res);
            }
          });
        } else {
          res.status(404).json({answer:"当前项目众筹未完成!"});
          return null;
        }

      }
    });
  } else {
    res.status(404).send("invalid");
  }
});

router.get("/",function (req,res,next) {
  console.log("get 到了!");
  res.send("hi!");
});


function reback(res, id, proData){
  var trade = model.trade;
  trade.create({
    starter: "Organized apply cash",
    receiver: id,
    expenditure: parseInt(proData.cost),
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
            describe: "Organized apply cash",
            to: req.session.address,
            toId: req.session.user,
            timeStamp: new Date().toUTCString(),
            amount: req.body.cost
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

