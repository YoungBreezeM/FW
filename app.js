console.time('start')
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let logger = require('morgan');//日志模块
let ejs = require('ejs');
let bodyParser = require('body-parser');
let app = express();
//过滤器
let filter = require('./bin/filter/path');
//引入路由
let index = require('./routes/index');
let login = require('./routes/login');
let logout = require('./routes/logout');
//管理员登录
let admin_role = require('./routes/admin/role/admin_role'),
    admin_role_add = require('./routes/admin/role/admin_role_add'),
    admin_role_update = require('./routes/admin/role/admin_role_update'),
    admin_role_remove = require('./routes/admin/role/admin_role_remove');
let admin_permission = require('./routes/admin/permission/admin_permission'),
    admin_password_edit = require('./routes/admin/admin/admin_list_update'),
    admin_permission_add = require('./routes/admin/permission/admin_permission_add'),
    admin_permission_update = require('./routes/admin/permission/admin_permission_update'),
    admin_permission_remove = require('./routes/admin/permission/admin_permission_remove');
let admin_list= require('./routes/admin/admin/admin_list'),
    admin_list_insert= require('./routes/admin/admin/admin_list_insert'),
    admin_list_remove = require('./routes/admin/admin/admin_list_remove'),
    admin_list_update = require('./routes/admin/admin/admin_list_update');
//系统模块
let system_category = require('./routes/system/system_category');
// 模板配置
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
// app.use(logger('dev'));
//中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//body-parser 配置
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/**
 * @package cookie-session
 * secet:"" 签名(伪加密)
 * resave :
 * saveUninitialized:true;
 * **/
//配置session中间件
app.use(session({
    secret:"yqf",//签名(伪加密 随便写，使用自带方法加密)
    name:"session_id",//保存在本地cookies的名字 默认为connect_sid
    resave:false,//true ：强制保存session 即使没变化 false:不强制保存
    saveUninitialized:true,//强制将未初始化的session存储
    rolling:true,//有操作重新计算时间
    cookie:{
        maxAge:60000*30,//30分钟不操作就过期
        httpOnly:true//禁止客户端通过js 修改cookies
    },
    // store:new MongoStore({负载均衡用得到
    //     secret: 'yqf',//签名
    //     url:"mongodb://127.0.0.1:27017/student",//数据库地址
    //     touchAfter:24*5000//在指定时间内,只要session内容不变，就会延迟更新通过这样做，设置touchAfter: 24 * 3600你说会话只在24小时内更新一次，无论发生多少请求（除了那些改变会话数据的东西）
    // })
}));
/**
 * @namespace 添加路由请安标准格式添加
 * "father"_"child"_"opration"
 * **/
//路由设置
//过滤器
app.all('/*',filter);
//主页面
app.use('/',index);
//登录&&退出
app.use('/login',login);
app.use('/logout',logout);
//管理员管理
//角色管理
app.use('/admin_role', admin_role);
  app.use('/admin_role_insert', admin_role_add);
  app.use('/admin_role_update',admin_role_update);
  app.use('/admin_role_remove',admin_role_remove)
//权限管理
app.use('/admin_permission', admin_permission);
  app.use('/admin_permission_insert', admin_permission_add);
  app.use('/admin_permission_update', admin_permission_update);
  app.use('/admin_permission_remove',admin_permission_remove);
//管理员管理
app.use('/admin_list', admin_list);
  app.use('/admin_list_insert', admin_list_insert);
  app.use('/admin_list_update', admin_list_update);
  app.use('/admin_list_remove',admin_list_remove);
//系统管理
app.use('/system_category',system_category);
app.listen(8080,function () {

    console.log("8080 port is open");
})
// module.exports = app;
console.timeEnd('start');