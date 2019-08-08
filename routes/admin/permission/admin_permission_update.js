let express = require('express');
let router = express.Router();
let permission = require('./permission');
let Model = require('../../../bin/config/config').Model,
    jurisdiction = Model.jurisdiction;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/permission/admin-permission-update');
});
router.post('/', function(req, res, next) {
    //信息提示表
    let info ={
        demoNone:'<script>alert("当前模块不存在");window.parent.location.reload();</script>',
        updateSuccess:"<script>alert(\"更新成功\");window.parent.location.reload()</script>",
        updateFail:'<script>alert("更新失败");window.parent.location.reload()</script>'
    }
    let postData = req.body;
    let finlData;
    // console.log(postData)
    permission.resolver(postData,'demoName',['demoName','name']).
    then(data=>{//合成提交数据
        return data&&permission.synthetic(data,jurisdiction.opration);
    }).
    then((data)=>{//提取数据
        return data&&{demoName: postData.demoName,name:postData.name,opration:data};
    }).
    then(data=>{
        finlData = data;
        return permission.getData({'demoName':data.demoName});
    }).
    then(data=>{
        // console.log(data,finlData)
        if (data[0]){//如果模块信息已经存在
            return permission.update({'demoName':finlData.demoName},finlData);
        }else{//不存在返回
            res.json(info.demoNone);
        }
    }).
    then(data=> {
        if (data) {
            res.send(info.updateSuccess);
        }
    },(err)=> {
        throw err;
        err&&res.send(info.updateFail);
    })
});
module.exports = router;
