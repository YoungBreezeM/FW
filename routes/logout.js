var express = require('express');
var router = express.Router();
/* GET login page. */
router.get('/', function(req, res, next) {
    req.session.cookie.maxAge = 0;//销毁session登录信息
    res.render('login');
});
// //处理post用户登录信息
// router.post('/', function(req, res, next) {
//
// });

module.exports = router;
