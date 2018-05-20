## 晶宝众筹 Crystal 后台部分
### 使用ExpressJs+mongoDB 内部逻辑尝试使用了区块链的部分思想
<ul>
<li>每条交易都会被记录在一个区块中</li>
<li>每个区块可以容纳10条交易</li>
<li>区块头记录了上一个区块的哈希值</li>
<li>所有交易都会经过数字签名验证</li>
</ul>

### 文件位置及说明
<pre>
/block  存放block相关逻辑方法和数据结构的文件
/common 存放其他数据库模型的文件
/public 存放前端页面和静态文件 
//由于后期写了个react-native 后台代码的res格式发生了改变，故目前Web端无法正常运作
/views  前台入口文件
/routes 处理不同API的路由文件
</pre>
<br>——————————<br>

###API
这个就不放了，还是学生，云服务器本来就快买不起了，万一被攻击了就不好了
遵循 MIT协议 开发者: tomokokawase


