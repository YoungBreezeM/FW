let express = require('express');
let router = express.Router();
let role = require('./role');
let permission = require('../permission/permission');
let roleModel = require('../../../bin/config/config').Model.role;
let jurisModel = require('../../../bin/config/config').Model.jurisdiction;
let resolver = require('../../../bin/resolver/resolver');
/* GET home page. */
router.get('/', function(req, res, next) {
    if(resolver.Role(req.session.admin)=='superAdmin'){
        permission.getData({}).
        then(data=>{
            return role.deleteKet(data,['_id']);
        }).
        then(data=>{
            res.render('admin/role/admin-role-add',{jsution:data});
        })
    }else {
        role.getData({'roleName':resolver.Role(req.session.admin)}).
        then(data=>{
            data[0]&&res.render('admin/role/admin-role-add',{jsution:data[0].jurisdiction});
        })
    }

});
router.post('/', function(req, res, next) {
    let info ={//信息反馈表
        demoExist:'<script>alert("当前角色已经存在");parent.location.reload();</script>',
        insertSuccess:"<script>alert(\"插入成功\");parent.location.reload()</script>",
        insertFail:'<script>alert("插入失败");parent.location.reload()</script>',
        passWeight:'<script>alert("插入权重不可超过自己的值");parent.location.reload()</script>'
    }
    let step ={}//用于缓存步骤数据
    role.toArray(req.body).
    then(data=>{//判断当前用户是否存在
        step.toArray = data;
        return role.getData({'roleName':data.roleName});
    }).
    then(data=>{//数据类型转化
        if(data[0]){//用户存在
            res.send(info.demoExist);
        }else {
            return resolver.Weight(resolver.Role(req.session.admin))//判断权重大小
        }
    }).
    then(data=>{
        if(data>req.body.weight){//权重必须小于当前角色的权重
            return role.synthetic(step.toArray,roleModel);
        }else{
            res.send(info.passWeight);
        }
    }).
    then(data=>{//数据合成
        if(data){
            step.roleDemo = data;//角色模块
            return role.resolver(req.body,'demoName',['demoName','name'])
        }
    }).
    then(data=>{//需要改进防止sql注入，如果是超级用户调用标准模板，不是调用当前模板
        return data&&role.synthetic(data,jurisModel,roleModel.jurisdiction);
    }).
    then(data=>{
        return data&&role.isHasOp(req.body,data,'demoName','opration');

    }).
    then(data=>{
        if(data){
            step.roleDemo.jurisdiction = data;
            return role.insert(step.roleDemo)
        }
    }).
    then(success=>{
        if(success){
            res.send(info.insertSuccess);
        }
    },fail=>{
        if (fail){
            throw fail;
            res.send(info.insertFail)
        }
    });
});
module.exports = router;
