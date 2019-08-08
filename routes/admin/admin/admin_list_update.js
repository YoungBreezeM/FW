let express = require('express');
let router = express.Router();
let role = require('../role/role');
let admin = require('./admin');
let config = require('../../../bin/config/config').Model;
let resolver = require('../../../bin/resolver/resolver');
let utilFw = require('../../../bin/util/util_fw');


let info ={//信息反馈表
    adminNone:'<script>alert("当前用户不存在");parent.location.reload();</script>',
    updateSuccess:"<script>alert(\"更新成功\");parent.location.reload()</script>",
    updateFail:'<script>alert("更新失败");parent.location.reload()</script>',
    passWeight:'<script>alert("更新权重不可超过自己的值");parent.location.reload()</script>',
    roleNone:'<script>alert("更新的角色找不到");parent.location.reload()</script>'
}
let adminInfo;
/* GET home page. */
router.get('/', function(req, res, next) {
        console.log(req.query)
        let step ={};
        admin.getData({adminName:req.query.adminName}).
        then(result=>{
            if(result&&result[0]){//用户存在
                step.adminRs = result[0];
                return resolver.Weight(result[0].role[0]);//解析更新权重值
            }else{
                res.send("用户不存在")
            }
        }).
        then(data=>{//解析更新权重值
            if(data){
                step.adminWeight = data;
                return resolver.Weight(resolver.Role(req.session.admin))
            }
        }).
        then(data=>{
            if(req.session.admin.adminName==req.query.adminName){
                if(data>=step.adminWeight){//权重合法
                    return role.getData({});
                }else {
                    res.send("你的权限太小");
                }
            }else {
                if(data>step.adminWeight){//权重合法
                    return role.getData({});
                }else {
                    res.send("你的权限太小");
                }
            }
        }).
        then(data=>{//过滤敏感信息
            return data&&role.deleteKet(data,['_id','jurisdiction']);
        }).
        then(data=>{
            if(data){
                step.roleRs = data;
                return utilFw.deleteKey(step.adminRs,['_id'])
            }
        }).
        then(data=>{
            adminInfo = data//缓存密码
            data&&res.render('admin/admin/admin-list-update',{role:step.roleRs,adminList:data});//返回到页面
        })
    });
router.post('/', function(req, res, next) {
    let step ={};
    admin.getData({'adminName':adminInfo.adminName}).then(data=>{
        if(data[0]){//如果用户存在
            return role.getData({"roleName":req.body.role})
        }else {
            res.send(info.adminNone);
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
            console.log(req.body.role)
            return resolver.Weight(req.body.role);
        }
    }).
    then(data=>{//权值比较
        console.log(data,step.weight)
        if(data){
            if(data[0]<step.weight[0]){//权重值不合法
                return admin.toTurn(req.body,config.Admins);
            }else {//初始化数据
                res.send(info.passWeight)
            }
        }
    }).then(data=>{
        if(data){
            if(adminInfo.password===data.password){//密码无修改
                return data;
            }else{
                return data&&utilFw.md5Col(data,['password']);
            }
        }
    }).
    then(data=>{//更新信息
        if(data){
            data.role= [data.role];
            return admin.update({adminName:adminInfo.adminName},data);
        }
    }).
    then(success=>{
        success&&res.send(info.updateSuccess)
    },fail=>{
        console.log(fail)
        fail&&res.json(info.updateFail);
    })

});
module.exports = router;
