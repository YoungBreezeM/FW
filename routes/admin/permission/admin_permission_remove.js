let express = require('express');
let router = express.Router();
let permission = require('./permission');
router.post('/', function(req, res, next) {
    permission.getData({'name':req.body.demoName}).
    then(data=>{
        if (data[0]){
            return permission.remove({'name':req.body.demoName});
        }else {
            res.json("不存在");
        }
    }).
    then(data=>{
        data&&res.json('success');
    },err=>{
        throw err;
        err&&res.json('fail');
    })
});
module.exports = router;
