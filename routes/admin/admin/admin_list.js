let express = require('express');
let router = express.Router();

let admin = require('./admin');
let utilFw = require('../../../bin/util/util_fw');
let resolver = require('../../../bin/resolver/resolver');
/* GET home page. */
router.get('/', function(req, res, next) {
    admin.getData({}).
    then(data=>{
        if(data){
           return utilFw.deleteKey(data,['_id','password']);
        }
    }).then(data=>{
        if(data){
            // console.log(data)
            res.render('admin/admin/admin-list',{adminList:data});
        }
    })
});
router.post('/', function(req, res, next) {
    let step ={};
    admin.getData({'adminName':req.body.adminName}).
    then(data=>{
        step.adminRS = data[0];//缓存数据
        console.log(data[0].role[0])
        if(data&&data[0]){//数据对象存在
            return resolver.Weight(data[0].role[0]);
        }else {
            console.log('对象不存在')
            res.json('对象不存在');
        }
    }).
    then(data=>{
        console.log(data)
        if(data){//
            step.old = data;
            return resolver.Weight(resolver.Role(req.session.admin));
        }
    }).
    then(data=>{
        if(data){
            if(data>step.old){//执行查找更新操作
                if(step.adminRS.status){
                    return admin.update({adminName:req.body.adminName},{status:false})
                }else {
                    return admin.update({adminName:req.body.adminName},{status:true})
                }
            }else {
                console.log('你的权限太小')
                res.json('你的权限太小')
            }
        }
    }).
    then(success=>{
        success&&res.json('success');
    },fail=>{
        console.log(fail)
        fail&&res.json('fail');
    })
});
module.exports = router;
