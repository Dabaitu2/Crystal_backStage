var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var model = require('../common/model');
var formidable = require('formidable');
var fs = require('fs');
var multiparty = require('multiparty');

router.post('/',function(req,res,next){
  console.log("收到新项目请求");
	if(req.session.user && req.session.userType===1){
				//设置上传参数

    // linux 不能使用绝对路径，要注意
    console.log(req.session.user);
    var dataBody = req.body;
		var form = new formidable.IncomingForm();
		form.encoding = 'utf-8';
		// form.uploadDir = './public/images/';
		form.uploadDir = '/usr/tempfl/fl/public/images/';
		form.keepExtensions = true;
		form.maxFieldsSize = 2*1024*1024;
		console.log('about to parse');
		//完成上传图片至img文件夹
		form.parse(req,function(error,fields,files){
		  console.log("进入回调");
			if(error){
				res.locals.error = error;
				console.log("something wrong")
				// res.redirect('/home');
			}
      if(files.uploadFile === undefined){
			  console.log("no files uploaded");
			  res.status(403).json({data:"You have not upload your image"});
			  return;
      }
			var extName = '';  //后缀名
      console.log(fields);
			switch (files.uploadFile.type) {
				case 'image/pjpeg':
					extName = 'jpg';
					break;
				case 'image/jpeg':
					extName = 'jpg';
					break;
        case 'image/jpg':
          extName = 'jpg';
          break;
				case 'image/png':
					extName = 'png';
					break;
				case 'image/x-png':
					extName = 'png';
					break;
			}
			console.log("扩展名="+extName);
			if(extName.length === 0 ){
				res.redirect('/home');
			}
			var fileName = Math.random() + '.' + extName;
      console.log("随机文件名="+fileName);
			var newPath = form.uploadDir+'stuff/' + fileName;
			fs.renameSync(files.uploadFile.path+'', newPath);  //重命名
			var readPath = '/images/stuff/'+fileName;


			var project = model.project;
			var user    = model.user;
			var newProject;
			project.find({},function(err,doc){
				var ID = doc.length;
					project.create({
					projectStarter: req.session.user,
					projectID:ID ,
					projectName:fields.projectName ,
					projectIntroduce:fields.projectIntroduce ,
					projectImage: readPath,
					projectFortune:0,
          projectTarget: fields.projectTarget,
					projectcompleted:0 ,
					projectParticipated:0 ,
					projectDate:fields.projectDate.split(","),
				},function(err,doc){
					if(err){
						console.log(err);
						res.status(404).json({data:'failed: text required'});
						return null;
					}else{
            newProject = doc;
            console.log("新项目"+newProject);
            var DataUpdate = [];
            var newProjectNum = 0;
            user.find({userId:req.session.user},function (err,doc) {
              if(err){
                console.log(err);
                res.status(404).json({data:'failed'});
                return null;
              } else {
                if(doc[0].userProject[0]===''){
                  console.log("该用户第一个项目建立!");
                  DataUpdate = doc[0].userProject;
                  newProjectNum = doc[0].projectInitiate + 1;
                  DataUpdate.pop();
                  DataUpdate.push(newProject.projectID);
                } else {
                  console.log("这不是该用户的第一个项目了");
                  DataUpdate = doc[0].userProject;
                  newProjectNum = doc[0].projectInitiate + 1;
                  DataUpdate.push(newProject.projectID);
                  console.log(DataUpdate);
                  console.log(newProject);
                }

                user.update({userId:req.session.user},{userProject:DataUpdate,projectInitiate: newProjectNum},{ multi: true },function (err,doc) {
                  if(err){
                    console.log(err);
                    res.status(404).json({data:'failed'});
                    return null;
                  } else {
                    console.log("项目绑定新建成功");
                    console.log(DataUpdate);
                    res.status(200).json({data:"success"});
                  }
                })

              }
            });
					}
				});
			});
		});
	}
  else{
    res.status(200).json({data:"not correct user"});
    return null;
  }
});

module.exports = router;
