let express = require('express');
let router = express.Router();
let DB = require("../bin/db/db"),
    admin =DB('Admins');//数据集合
let utilFw = require('../bin/util/util_fw');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login');
});
//处理post用户登录信息
router.post('/', function(req, res, next) {
    //登录信息提示重定向表
    let info ={
        userNone:"<script>alert('登录失败当前用户不存在');window.location.href='/'</script>",
        login  : '<script>alert("你已经登录");window.location.href="/"</script>',
        passwordErr:"<script>alert('登录失败请重新输入密码');window.location.href='/'</script>",
        stop:'<script>alert(\'你已被禁止登录,请及时联系管理员\');window.location.href=\'/\'</script>'
    }
    //登录验证
    let loginCheck = function(result,password){
        if (result){//有返回值表示用户存在
            if(result.password==utilFw.encryption(password)){//密码校验
                //登录成功存储session
                if(result.status){
                    req.session.admin = result;//缓存用户信息
                    res.send(info.login);
                }else {
                    res.send(info.stop)
                }
            }else{
                res.send(info.passwordErr);
            }
        }else {//用户不存在
            res.send(info.userNone);
        }

    };
    let adminName = req.body.adminName;
    let password = req.body.password;
    admin.find({"adminName":adminName})//查找用户信息
        .then(function (result) {
           loginCheck(result[0],password);//校验用户信息
        });
});

module.exports = router;
