let utilFw = require('../util/util_fw');
/**
 * @namespace DB mongoDB 3.0版本
 * @param DB.db  数据库名
 * @param DB.host 服务器对象
 * @param DB.port 端口号
 * **/
const DB = {
     db:'FWadmin',
     host:'localhost',
     port:27017

};
/**
 * @namespace Car 默认路由通行证，只有在通行证里的路由请求为合法请求
 * @namespace Car.frontCard 前端路由通行证，保存前端页面路由
 * @namespace Car.adminCard 后端端路由通行证，保存后端端页面路由
 *
 * **/
const Car = {
     frontCard:{
          /**
           * @param  登录前路由通行路由配置
           * @param  key 为路由路径
           * @param  value 为路由是否开启
           */
          '/login':true,
          '/logout':true//退出页面
     },
     adminCard:{//登陆后路由通行配置
          '/':true,//主页路由
          '/system_category':true
     }

}
/**
 * @namespace Model 用来规范数据的格式
 * **/
const Model = {
     jurisdiction :{//权限管理数据模板
          name:"",
          demoName:"",
          opration:{
               '插入操作': false,
               '删除操作': false,
               '只能操作自己的':false,
               '查看功能':false,
               '更新操作':false
          }
     },
     role:{//角色管理数据模板
          roleName: [],
          adminList: [],
          describle:[],
          weight:[],
          jurisdiction:[]
     },
     Admins:{//管理员数据模板
          "openId" : [ ],
          "adminName" : "",
          "password" : "",
          "email" : "",
          "phone" : "",
          "time" : utilFw.getDateTime(),
          'describe':'',
          "status" : true,
          "role" : [ ]
     }
}
/**
 * @namespace Status 数据转意表
 * **/
const Status ={
     'insert':'插入操作',
     'remove':'删除操作',
     'onlySelf':'只能操作自己的',
     'find':'查看功能',
     'update':'更新操作',
}
module.exports = {
     DB:DB,
     Car:Car,
     Model:Model,
     Status:Status,
};