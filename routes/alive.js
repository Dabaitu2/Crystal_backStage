/**
 *    Created by tomokokawase
 *    On 2018/2/8
 *    阿弥陀佛，没有bug!
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


router.get('/',function(req,res,next){
  if(req.session.user){
    res.json({answer:"success"});
  } else{
    res.send({answer:"failed"});
  }

});

module.exports = router;
