let express = require('express');
let router = express.Router();
let role = require('../role/role');
let admin = require('./admin');
let config = require('../../../bin/config/config').Model;
let resolver = require('../../../bin/resolver/resolver');
let utilFw = require('../../../bin/util/util_fw');

let info ={//信息反馈表
    demoExist:'<script>alert("当前用户已经存在");parent.location.reload();</script>',
    insertSuccess:"<script>alert(\"插入成功\");parent.location.reload()</script>",
    insertFail:'<script>alert("插入失败");parent.location.reload()</script>',
    passWeight:'<script>alert("插入权重不可超过自己的值");parent.location.reload()</script>',
    roleNone:'<script>alert("插入角色找不到");parent.location.reload()</script>'
}
/* GET home page. */
router.get('/', function(req, res, next) {
    role.getData({}).
    then(data=>{//获取角色表所有信息
        return data[0]&&role.deleteKet(data,['_id','jurisdiction']);
    }).
    then(data=>{//删除完敏感信息
        // console.log(data)
       data[0]&&res.render('admin/admin/admin-add',{role:data});//返回到页面
    })
});
/* post home page. */
router.post('/', function(req, res, next) {
    let step ={};
    admin.getData({'adminName':req.body.adminName}).then(data=>{
        if(data[0]){//如果用户存在
            console.log('用户已近存在')
            res.send(info.demoExist)
        }else {
            return role.getData({"roleName":req.body.role})
        }
    }).
    then(data=>{
        if(data&&data[0]){//如果角色存在
            return resolver.Weight(resolver.Role(req.session.admin));//解析当前权限
        }else {
            data&&res.send(info.roleNone)
        }
    }).
    then(data=>{//权限值缓存，解析
        if (data){
            step.weight =data;
            return resolver.Weight(req.body.role);
        }
    }).
    then(data=>{//权值比较
        if(data){
            if(data[0]<step.weight[0]){//权重值不合法
                return admin.toTurn(req.body,config.Admins);
            }else {//初始化数据
                res.send(info.passWeight)
            }
        }
    }).then(data=>{
        return data&&utilFw.md5Col(data,['password']);
    }).
    then(data=>{//插入信息
        if(data){
            data.role= [data.role];
            return admin.insert(data);
        }
    }).
    then(success=>{
        success&&res.send(info.insertSuccess)
    },fail=>{
        fail&&res.json(info.insertFail)
    })

});
module.exports = router;
