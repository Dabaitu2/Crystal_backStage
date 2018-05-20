var Block = require('./Block');
var mongoose = require('mongoose');
var model = require('./model');
var crypto = require('crypto');


// 以上一区块为基础创建新区块
// 单线程,当心异步问题



function getBlock(id,res){
  getLastBlock(createNew,id,res);
}

function getLastBlock(createNew,id,res){
  var Block = model.block;
  var data;
  Block.find({},function(error,doc){
    data = doc;
    var GLBV = undefined;
    if (data.length > 1) {
      GLBV = createNew(data[data.length - 1], id, res);
    } else {
      GLBV = createNew(data[0], id, res);
    }

    return GLBV;
  });
}


/**
 * 创建新区块
 * @param lastBlock 上一曲块
 * @param id
 *
 * */

function createNew(lastBlock, id, res){
  console.log("==========开始创建新区块,当前id"+id+"=============")

  var index, previousHash, timestramp, data, sha256, hash, newBlock, blockchain;

  if(lastBlock!==undefined) {
    console.log("本区块非创世区块\n","前块哈希"+lastBlock.hash);
    index        = Number(lastBlock.index) + 1;
    previousHash = lastBlock.hash;
  } else {
    console.log("本块为创世区块");
    index        = 1;
    previousHash = "----initial block-----";
  }

  timestramp   = new Date().getTime() / 1000;
  data         = [];
  sha256       = crypto.createHash('sha256');
  hash         = sha256.update(index + previousHash + timestramp).digest('base64');
  newBlock     = new Block(index, previousHash, timestramp, data, hash);

  blockchain   = model.block;
  blockchain.create(newBlock, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc);
    }
  });

  console.log(new Date().getTime());
  res.status(200).send({
    status:"success",
  });

}


module.exports = getBlock;

