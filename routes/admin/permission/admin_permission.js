let express = require('express');
let router = express.Router();
let jurist = require('./permission');//创建一个对象
/* GET home page. */
router.get('/', function(req, res, next) {
    jurist.getData().then(data=>{//获取数据返回给前端
        jurist.getFitter(data,{
            'delete':'demoName'
        }).then(data=>{
            // console.log(data)
            res.render('admin/permission/admin-permission',{'Jlist':data});
        });
    })
});
router.post('/', function(req, res, next) {
    jurist.getData({"name":req.body.demoName}).then(data=>{
        if(data[0]){
            let {name:name,demoName:demoName,opration:opration} = data[0];
            res.json({name:name,demoName:demoName,opration:opration});
        }else {
            res.send('<script>alert("没有当前模块");window.location.reload()</script>')
        }
    });

});
module.exports = router;
