let DB = require("../db/db"),//调用数据对象
    RoleDb =DB('Roles'),//管理员数据库对象
    jurisdiction = DB('jurisdiction');//可操作模块
let config = require('../config/config');
// let utilFw = require('../util/util_fw');

/**
 * @param Data 是async方法
 * @Param roleData 是角色数据
 * @param jurisdictionData 权限数据
 * **/
let Data =async function(){//获取数据
    try {
        let [roleData,jurisdictionData] = await Promise.all([RoleDb.find({}),jurisdiction.find({})]);//并发处理数据
        return {roleData:roleData,jurisdictionData:jurisdictionData};
    }catch (e) {//抛出异常
        throw e;
    }

}

let target = {//被代理的对象
    /**
     * 管理员角色解析器
     * @param  Role(admin) 解析角色方法
     * @param  具有返回值 为解析完成角色
     * @param  admin  传入的管理员对象
     * **/
    Role:function(admin){
        return admin.role[0];//这边直接解析一个角色
    },
    /**
     * 角色操作权限解析器
     * @param   key(role) 解析角色权限
     *  @param  具有返回值 为解析完成权限
     *  @param  role 为角色对象
     * **/
    GetKey:async function(role){
        let jurisdiction = await Data().then(data=>{
            let index = data.roleData.findIndex(value=>{
                return value['roleName'][0]==role;
            });
            if(index>=0)
                return data.roleData[index]['jurisdiction'];
            else
                return null;
        }).catch(err=>{
            throw err;
        })
        return jurisdiction;//返回操作权限
    },
    /**
     * 操作权限判断器
     * @param Opration(url,keycol)
     * @param 方法有返回值
     * @param url    要进行操作的路由
     * @param keycol 操作集合
     * **/
    Opration:async function(url,keyCol){
        let T = {};//返回数据缓冲区
        let opration = {
            start: async function (url, keyCol) {//判断路由是否存在
                let that = this;
                return await Data().then(function (data) {
                    T = that.isHas(url, keyCol, data.jurisdictionData);//权限解析
                    return T;
                })
            },
            isHas: (url, keyCol, data) => {//权限解析
                let t = {};
                for (let i in keyCol) {
                    if (keyCol[i]['demoName'] == url) {//判断主路由是否存在
                        t = {url: url, status: true};
                        break;
                    } else if (new RegExp(keyCol[i]['demoName']).test(url)) {//解析子路由权限
                        let op = url.match(/([^_]+)$/)[1]
                        let q = op.split(/\?|=|&&/);
                        let top;
                        for (let i in q) {
                            if (config.Status[q[i]]) {
                                top = config.Status[q[i]];
                                break;
                            }
                        }
                        if (keyCol[i]['opration'][top]) {
                            t = {url: url, status: true};
                            break;
                        } else {
                            t = {url: url, status: false};
                        }
                    } else {
                        for (let i in data) {
                            if (data[i]['demoName'] == url) {//判断路由是否合法
                                t = {url: url, status: false};
                                break;
                            }
                        }
                    }

                }
                return t;
            }
        }
        if(keyCol)
            return opration.start(url,keyCol)
        else
            return null;
    },
    /**
     * @namespace  权重解析 用于管理之间操作的判断该
     * @param  admin 传入解析器的参数为管理员对象
     * @param  Role 方法做管理员角色解析
     * @param  weight 方法做角色权重解析
     * **/
     Weight :async function (role) {
        return Data().then(data=>{
            let index = data.roleData.findIndex(value=>{
                return value['roleName']==role;
            })
            if(index>=0)
                return data.roleData[index]['weight'];
            else
                return null;

        })
    }
}
let handle ={//操作处理
    get:(target,propoty)=>{
        if(propoty in target){//判断目标函数是否存在该函数
            return Reflect.get(target,propoty);
        }else {
            throw new Error('this is not a function')
        }
    },
    set:()=>{
        throw new Error('this is cant to set')
    }

}

let proxy = new Proxy(target,handle);//创建一个代理器保证解析方法的安全

module.exports =proxy;