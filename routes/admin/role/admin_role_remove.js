let express = require('express');
let router = express.Router();
let role = require('./role');
let resolver = require('../../../bin/resolver/resolver');
/* GET home page. */
router.post('/', function(req, res, next) {
    let step ={};
    role.getData({"roleName":req.body.roleName}).
    then(result=>{
        // console.log(result[0])
        if(result[0]){//如果该信息存在
            step.findRs = result[0];
            return resolver.Weight(resolver.Role(req.session.admin))//判断权重大小
        }else {
            res.json('infoNone');
        }
    }).
    then(data=>{
        if(data>step.findRs.weight){
            return role.remove({"roleName":req.body.roleName});
        }else {
            res.json('noWeight');
        }

    }).
    then(success=>{
        success&&res.json('success')
    },fail=>{
        fail&&res.json('fail')
    })

});

module.exports = router;
