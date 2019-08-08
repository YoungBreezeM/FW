let express = require('express');
let router = express.Router();
let role = require('./role');
/* GET home page. */
router.get('/', function(req, res, next) {
    role.getData().
    then(result=>{//获取role数据
        // console.log(result);
        return role.deleteKet(result,['_id'])//删除id
    }).
    then(result=>{//获取已经删除完的数据
        res.render('admin/role/admin-role',{roleList:result});
    })
});

module.exports = router;
