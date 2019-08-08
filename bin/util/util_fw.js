let crypto = require('crypto');
/**
 * @namespace 工具方法集合
 * **/
let target = {//工具目标对象
    /**
     * @param array 目标
     * @param v 要查找的值
     * @param 判断数组类型
     * **/
    toExistA:async function(array,v){//判断数组中是否存在指定参数
        if(array instanceof Array){
            return array.includes(v);
        }else {
            throw new Error("array "+array+" is not a Array")
        }
    },
    /**
     * @param 判断数组对象类型
     * @param arrobj 对象数组
     * @param key 要查找的对象键
     * @param value 要查找的值
     * **/
    toExistOA : async function(arrobj,key){
        if(arrobj instanceof Object){
            return await arrobj.find((val)=>{
                return val[key];
            });
        }else {
            throw new Error(arrobj+' is not a Object');
        }

    },
    /**
     * @param 用于查找对象类型
     * @param obj 数据对象
     * @param key 要查找的键值
     * **/
    toExistO : async function(obj,key){
        if(obj instanceof Object){
            if(key in obj){
                return obj[key];
            }else{
                return null;
            }
        }else {
            throw new Error(obj+' is not a Object');
        }

    },
    /**
     * @namespace deepCopy
     * @param o 要拷贝的目标对象
     * **/
    deepCopy:function(o) {
            if (o instanceof Array) {
                let n = [];
                for (let i in o) {
                    n[i] = this.deepCopy(o[i]);
                }
                return n;

            } else if (o instanceof Object) {
                let n = {}
                for (let i in o) {
                    n[i] = this.deepCopy(o[i]);
                }
                return n;
            } else {
                return o;
            }
    },
    /**
     *@namespace toArray 将指定对象的值初始化
     *@param target 目标对象
     * @param value 初始化的值
     * @param key 指定键初始化
     * **/
     toInit:async function(target,value,key){
        try{
            if(target){
                if(key){
                    for (let i in target){
                        for(let j in target[i][key]){
                            if(target[i][key][j]){
                                target[i][key][j] = value;
                            }else{
                                delete target[i][key][j];
                            }

                        }
                    }
                }else{
                    for (let i in target){
                        target[i] = value;
                    }
                }
                return target;
            }else{
                throw new Error('target or value is empty')
            }
        }catch (e) {
            throw e;
        }
    },
    /**
     * @namespace toTurn 数值转换
     * @param taregt 目标对象
     * @param model 最终模型
     * @param key 指定相同的键赋值
     * @ 算法处理
     * **/
    toTurn:async function(taregt,model,key){
        if(key){
            for(let i in taregt){
                for(let j in taregt[i]){
                    for(let k in model){
                        if(j in model[k]&&taregt[i][key]==model[k][key]){
                            if(typeof taregt[i][j]=='object'){
                                for(let l in taregt[i][j]){
                                    if(l in model[k][j]){
                                        model[k][j][l] = taregt[i][j][l]
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return model;
        }else {
            throw new Error('key cant empty')
        }

    },
    /**
     * @namespace getDateTime 获取当前时间
     * **/
    getDateTime:function() {
        let date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return year + seperator1 + month + seperator1 + strDate;
    },
    /**
     * @namespace encryption md5 重复加密算法
     *@param str 要加密的字符串
     * **/
     encryption:function(str){
         if(str&& typeof str=='string'){
             for (let i=0;i<str.length;i++){
                 str = crypto.createHash('md5').update(str).digest("hex")
             }
             return str;
         }else {
             throw new Error('str cant empty')
         }
    },
    /**
     * @namespace md5Col 集合指定键删除
     * **/
    md5Col:async function (target,keyCol) {
        if(target instanceof Object){
            let t = this.deepCopy(target);//深度拷贝
            keyCol.map(value=>{//遍历键值集合
                if(value in t){
                    t[value] = this.encryption(t[value]);
                }
            })
            return t;
        }else {
            throw new Error('target type is not Object')
        }
    },
    /**
     * @namespace deleteKet 删除指定键值
     * @param target 要删除的源数据
     * @param keycol 要删除的键值集合
     * **/
    async deleteKey(target,keycol) {
        if(keycol&&target){
            let stack = this.deepCopy(target);//深度拷贝对象
            if(this.toType(target)==='Object'){
                keycol.forEach(val => {//删除指定值
                    delete stack[val];
                })
                return stack;
            }else if(this.toType(target)==='ArrObj'){
                stack.find(value => {
                    keycol.forEach(val => {//删除指定值
                        delete value[val];
                    })
                })
                return stack;
            }
        }else {
            throw new Error('keycol cant empty')
        }
    },
    /**
     * @namespace toType 判断引用数据类型
     * @param v 要判断该数据
     * **/
    toType:function(v){
    if(v){
        let type = {
            array:'Array',
            object:'Object',
            arrobj:'ArrObj'
        }
        if(v instanceof Array){
            for(let i in v){
                if(v[i] instanceof Object){
                    return type.arrobj
                }else {
                    return type.array
                }
            }

        }else if(v instanceof Object){
            return type.object
        }
    }else {
        throw new Error('v cant empty')
    }

}

}
let handler = {//拦截处理
    get:function(target,propoty){
        if(propoty in target){//判断目标函数是否存在该函数
            return Reflect.get(target,propoty);
        }else {
            throw new Error('该解析操作不存在')
        }
    },
    set:function(){
        throw new Error('解析方法不可修改')
    }
}
let proxy = new Proxy(target,handler);//创建一个代理
module.exports = proxy;