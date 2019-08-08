let express = require('express');
let router = express.Router();
let resolver = require('../../../bin/resolver/resolver');
let admin = require('./admin');
/* GET home page. */
router.post('/', function(req, res, next) {
    let step ={};
    console.log(req.body.adminName)
    admin.getData({'adminName':req.body.adminName}).
    then(result=>{//查找当前用户是否存在
        if (result&&result[0]){//用户存在
            return resolver.Weight(result[0].role[0])//解析用户权重大小
        }else {
            res.json('用户不存在');
        }
    }).then(data=>{
        if(data){//解析完成
            step.adminWeight = data;
            return resolver.Weight(resolver.Role(req.session.admin))//解析当前用户权重大小
        }
    }).
    then(data=>{
        if(data>step.adminWeight){//当前用户的权重大于要删除的用户
            return admin.remove({"adminName":req.body.adminName});
        }else {
            res.json('你的权限不够');
        }
    }).then(success=>{
        console.log(success)
        success&&res.json('success');
    },fail=>{
        throw fail;
        fail&&res.json('fail')
    })
});

module.exports = router;
