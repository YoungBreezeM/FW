let express = require('express');
let router = express.Router();
let permission = require('./permission');
let Model = require('../../../bin/config/config').Model,
    jurisdiction = Model.jurisdiction;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/permission/admin-permission-add');
});
router.post('/', function(req, res, next) {
    //信息提示表
    let info ={
        demoExist:'<script>alert("当前模块已经存在");parent.location.reload();</script>',
        insertSuccess:"<script>alert(\"插入成功\");parent.location.reload()</script>",
        insertFail:'<script>alert("插入失败");parent.location.reload()</script>'
    }
    let postData = req.body;
    let finlData;
    // console.log(postData)
    permission.resolver(postData,'demoName',['demoName','name']).
    then(data=>{//合成提交数据
       return data&&permission.synthetic(data,jurisdiction.opration);
    }).
    then((data)=>{//
        return data&&{demoName: postData.demoName,name:postData.name,opration:data};
    }).
    then(data=>{
        finlData = data;
        return permission.getData({'demoName':data.demoName});
    }).
    then(data=>{
        if (data[0]){//如果模块信息已经存在
            res.send(info.demoExist);
        }else{//不存在插入数据
            // console.log(finlData)
            return permission.insert(finlData);
        }
    }).
    then(data=> {
        if (data) {
            res.send(info.insertSuccess);
        }
    },(err)=> {
        res.send(info.insertFail);
        throw err;
    }).catch(err=>{
        throw err;
    })
});
module.exports = router;
