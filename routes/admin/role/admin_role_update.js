let express = require('express');
let router = express.Router();
let role = require('./role');
let permission = require('../permission/permission');
let roleModel = require('../../../bin/config/config').Model.role;
let jurisModel = require('../../../bin/config/config').Model.jurisdiction;
let utilFw = require('../../../bin/util/util_fw');
let resolver = require('../../../bin/resolver/resolver');
let info ={//信息反馈表
    demoNone:'<script>alert("当前角色不存在");parent.location.reload();</script>',
    updatetSuccess:"<script>alert(\"更新成功\");parent.location.reload()</script>",
    updateFail:'<script>alert("更新失败");parent.location.reload()</script>',
    weightLower:'<script>alert("您的权重值小于要修改对象");parent.location.reload()</script>',
    passWeight:'<script>alert("您的权限过小");parent.location.reload()</script>'
}
let roleStack;
/* GET home page. */
router.get('/', function(req, res, next) {
    let step ={};
    if(req.query.roleName){
        role.getData({"roleName":req.query.roleName}).
        then(data=>{
            if(data[0]){
                roleStack = data[0];
                step.roleDemo = data[0];
                return resolver.Weight(resolver.Role(req.session.admin))//解析权重大小
            }else {
                res.send(info.demoNone);
            }
        }).
        then(data=>{
            if(data>=step.roleDemo.weight){//判断权重值大小
                if(resolver.Role(req.session.admin)=='superAdmin'){
                    return permission.getData({});//输出全部模板信息
                }else {
                    return role.getData({roleName:resolver.Role(req.session.admin)});//输出当前用户模板

                }
            }else {
                res.send(info.weightLower);
            }
        }).
        then(data=>{
            if(data&&'jurisdiction' in data[0]){//不是超级管理员
                step.admin = data;
                data = data[0]['jurisdiction'];
            }
            return data&&role.deleteKet(data,['_id']);
        }).
        then(data=>{//初始化数据
            return data&&utilFw.toInit(data,false,'opration');
        }).
        then(data=>{//数值转化
            return data&&utilFw.toTurn(step.roleDemo.jurisdiction,data,'demoName');
        }).
        then(data=>{
            data&&res.render('admin/role/admin-role-update',{jsution:data,roleDate:step.roleDemo});

        })
    }
});
router.post('/', function(req, res, next) {
    let step ={}//用于缓存步骤数据
    role.toArray(req.body).
    then(data=>{//判断当前用户是否存在
        step.toArray = data;
        return role.getData({'roleName':roleStack.roleName});
    }).
    then(data=>{//数据类型转化
        if(data&&data[0]){//用户存在
            return resolver.Weight(resolver.Role(req.session.admin))//解析权重大小
        }else {
            res.send(info.demoNone);//模块不存在
        }
    }).
    then(data=>{
        // console.log(req.body.roleName,req.session.admin.role)
        if(data){
            if(data>req.body.weight){
                return role.synthetic(step.toArray,roleModel);
            }else {
                res.send(info.passWeight)
            }
        }
    }).
    then(data=>{//数据合成
        if(data){
            step.roleDemo = data;//角色模块
            return role.resolver(req.body,'demoName',['demoName','name'])
        }
    }).
    then(data=>{
        return data&&role.synthetic(data,jurisModel,roleModel.jurisdiction);
    }).
    then(data=>{
        return data&&role.isHasOp(req.body,data,'demoName','opration');

    }).
    then(data=>{
        if(data){
            step.roleDemo.jurisdiction = data;
            return role.update({roleName:roleStack.roleName},step.roleDemo)
        }
    }).
    then(success=>{
        if(success){
            res.send(info.updatetSuccess);
        }
    },fail=>{
        if (fail){
            throw fail;
            res.send(info.updateFail)
        }
    });

});
module.exports = router;
