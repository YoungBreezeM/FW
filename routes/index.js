var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //返回用户名
    res.render('index',{adminName:req.session.admin.adminName,role:req.session.admin.role});
});

module.exports = router;