let DB = require("../db/db"),//调用数据对象
    Admins =DB('Admins');//管理员数据库对象
let Car = require('../config/config').Car,//路由通行证
    frontCard = Car.frontCard,
    adminCard = Car.adminCard;
let resolver = require('../resolver/resolver');//管理员解析器

let path = function (req,res,next) {
    let infoBack = {//信息反馈表
        toLogin:'<script>alert("您的登录信息失效，请重新登录");window.parent.parent.location.href="/login"</script>',
        noPower:'你没有该权限',
        noRouter:'当前路由不存在',
        noAttribute:'属性不存在',
        noOpen:'路由未开放'
    }
    let target = {
        start:function(){
            if(req.url in frontCard){//判断路由是否存在于前端表
                if(!frontCard[req.url]){//接口开放性判断
                    res.send(infoBack.noOpen);
                }else {
                    next();//通行
                }
            }else{//判断路由是否在后端,进入后端前进行登录判断，如果未登录，将拦截一切路由
                this.isLogin();
            }
        },
        isLogin:function (){
            if (req.session.admin) {//如果管理员登录，获取进入后台权限，执行权限判断
                this.isSuperAdmin();//权限解析
            }else {//返回到登录
                res.send(infoBack.toLogin)
            }
        },
        isAdminUrl:function(){
            resolver.GetKey(resolver.Role(req.session.admin)).then(key=>{//解析用户的操作权限
                return resolver.Opration(req.url,key);
            }).then(rs=>{
                    // console.log(rs)
                    //临时追加后台通行路由
                    if(rs&&rs.url!='/')
                        adminCard[rs.url] = rs.status;
                    // console.log(adminCard)
                    if(req.url in adminCard){//判断路由是否存在
                        if(!adminCard[req.url]){
                            res.json(infoBack.noPower);//权限不够
                        }else {
                            next();//通行
                        }
                    }
                    else{//路由不存在
                        res.send(infoBack.noRouter);
                    }
                })

        },
        isSuperAdmin:function(){
            if(resolver.Role(req.session.admin)==="superAdmin")
                next();//获取全部通行的资格
            else
                this.isAdminUrl();//解析用户角色，为后台通行表附加有效路由
        }

    }
    let handel={
        get:(target,property)=>{
            if(property in target){//判断方法是否存在
                return Reflect.get(target,property);
            }else{
                throw new Error(infoBack.noAttribute)
            }
        },
        set:(target,property,value)=>{
            if(property in target){
                Reflect.set(target,property,value);
            }else{
                throw new Error(infoBack.noAttribute);
            }
        }
    }
    let proxy = new Proxy(target,handel);//设置一个代理模式用于数据拦截定向
    proxy.start();//开始拦截操作

}
module.exports = path;