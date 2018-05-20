/**
 *    Created by tomokokawase
 *    On 2018/2/15
 *    阿弥陀佛，没有bug!
 */



var a = [];
var count = 0;
var flag = 0;
for(var i = 0;i<10; i++){
  a.push(new Promise(function (resolve,reject) {
    setTimeout(function () {
      if(count%2!==0){
        reject("失败失败");
        console.log("task"+count);
        count++;
        // flag++;
      } else {
        resolve("成功成功");
        console.log("task"+count);
        count++;
        flag++;
      }
    },1000*i);
  }).then(function () {
    console.log("我完成了")
  }).catch(function () {
    console.log("我失败了")
  }));
}


Promise.all(a).then(function () {
  if(flag === 10) {
    console.log("finished!");
  } else {
    console.log("failed!");
  }
}).catch(function () {
  console.log("failed");
});
