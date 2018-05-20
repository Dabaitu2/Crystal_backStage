var Block = require('./Block');
var mongoose = require('mongoose');
var model = require('./model');
var crypto = require('crypto');


// 以上一区块为基础创建新区块
// 单线程,当心异步问题



function getBlock(pw,id,res,resolve, reject){
  getLastBlock(pw,createNew,id,res,resolve, reject);

}

function getLastBlock(pw,createNew,id,res,resolve, reject){
	var Block = model.block;
	var data;
	Block.find({},function(error,doc){
	  if(error){
	    reject('something wrong');
    }
		data = doc;
    var GLBV = undefined;
		if (data.length > 1) {
		  GLBV = createNew(pw, data[data.length - 1], id, res, resolve, reject);
    } else {
      GLBV = createNew(pw, data[0], id, res, resolve, reject);
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

function createNew(out, lastBlock, id, res, resolve, reject){
  console.log("==========开始创建新区块,当前id"+id+"=============")

  var index, previousHash, timestramp, data,
      password, keyValue, md5, hash, newBlock, blockchain;

  if(lastBlock!==undefined) {

    console.log("本区块非创世区块\n","前块哈希"+lastBlock.hash);

    index        = Number(lastBlock.index) + 1;
    previousHash = lastBlock.hash;
    timestramp   = new Date().getTime() / 1000;
    data         = [];

    password     = getRandomPassword();
    keyValue     = {[id]: password};
    data.push(keyValue);

    md5      = crypto.createHash('md5');
    hash     = md5.update(index + previousHash + timestramp).digest('base64');
    newBlock = new Block(index, previousHash, timestramp, data, hash);

    console.log("新区块生成:"+newBlock);
    console.log(new Date().getTime());


    blockchain = model.block;
    blockchain.create(newBlock, function (err, doc) {
      if (err) {
        console.log(err);
        reject('something wrong');

      } else {
        console.log(doc);
        resolve("finished!");
      }
    });
  } else {
    console.log("本块为创世区块");
    index        = 1;
    previousHash = "----initial block-----";
    timestramp   = new Date().getTime() / 1000;
    data         = [];
    password     = getRandomPassword();
    keyValue     = {[id]: password};
    data.push(keyValue);

    md5 = crypto.createHash('md5');
    hash = md5.update(index + previousHash + timestramp).digest('base64');
    newBlock = new Block(index, previousHash, timestramp, data, hash);

    console.log("新区块生成:"+newBlock);

    blockchain = model.block;
    blockchain.create(newBlock, function (err, doc) {
      if (err) {
        console.log(err);
        reject('something wrong');

      } else {
        console.log(doc);
        resolve("finished!");
      }
    });
  }
  out = password;
  console.log(password);
  console.log(new Date().getTime());
  res.status(200).json({
    status:"success",
    password: password
  });

  return password;
}

//  获取随机的密码
function getRandomPassword(){
	var text=['abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ','1234567890','~!@#$%^&*()_+";",./?<>'];
	var rand = function(min, max){return Math.floor(Math.max(min, Math.random() * (max+1)));};
	var len = rand(8, 16); // 长度为8-16
	var pw = '';
	for(var i=0; i<len; ++i)
	{
	var strpos = rand(0, 3);
	pw += text[strpos].charAt(rand(0, text[strpos].length));
	}
	return pw;
}


module.exports = getBlock;

