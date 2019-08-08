let Db = require('../../../bin/db/db'),//获取数据对象
    JuristDb = Db('jurisdiction');//创建数据操作对象
/**
 * @namespace Jurist 数据操作对象
 * @param getData 获取该对象的全部数据
 * @param getFitter 获取到的信息进行过滤
 * @param deleteKey 删除一个你要删除的键
 * **/
let Jurist = class Jurist{
    constructor(){
        this.info ={

        }
    }
    /**
     * @namespace getData 获取对象数据
     * @param v 要操作的对象
     * **/
    async getData(v={}){//获取全部操作模块
        try {
            return await JuristDb.find(v);
        }catch (e) {
            throw e;
        }
    }
    /**
     * @namespace getFitter 过滤信息
     * @param target 目标对象
     * @param key 要过滤的键值集合
     * **/
    async getFitter(data,key){//获取信息过滤
        let that = this;
        let fitter = {//可过滤信息
            'delete':that.deleteKey,
        }
        if(data&&key){
            let stack = data;
            for(let i in key) {//根据key执行相应的方法
                stack = await fitter[i](stack,key[i]);
            }
            return stack;
        }else if(data){
            return data;//原数据
        }else {
            throw new Error('getFitter(^data,key)  cant empty');
        }
    }
    /***
     * @namespace deleteKey 删除指定的键
     * @param target 目标数据对象
     * @param key 你要删除的键值
     * **/
    async deleteKey(target,key){//删除一个你要删除的键
        if(target&&key){
            target.find(value=>{
                delete value[key];
            })
        }else {
            throw new Error('please input data or key')
        }
        return target;
    }
    /**
     * @namespace resolver 用于解析指定的数据对象
     * @param target 要解析的目标对象
     * @param key 要解析的键值
     * @param toKey 要转化的键
     * **/
    async resolver(target,key,toKey){
        if(target&&key){
            if(toKey instanceof Array&&Object){
                if(key in target){
                    target[toKey[1]] = target[key].match(/([^/]+)$/)[1];
                    target[toKey[0]] = target[key].replace(/([/][^/]+)$/,"");
                }
            }else {
                throw new Error('toKey is not a Array')
            }
        }
        else {
            throw new Error('resolver () var is not empty')
        }
        return target;
    }
    /**
     * @namespace synthetic 合成标准数据
     * @param data 想要合成的数据源
     * @param model 想要合成的模板格式
     * @param 返回模板数据必须放在函数内，可以做到没次都初始化
     * **/
    async synthetic(data,model){//合成数据]
        let t ={};
        for(let i in model){
            t[i] = model[i];//给模板赋初值
        }
        for(let i in data){//判断该模板的值
            if (i in t)
                t[i]=data[i];
        }
        return t;
    }
    /**
     * @namespace insert 插入一条数据
     * @param target 要插入的对象
     * **/
    async insert(target){
        try {
            return  await JuristDb.insert(target);
        }catch (e) {
            throw e;
        }
    }
    /**
     * @namespace update 更新一条数据
     * @param where 要更新的对象
     * @param data 要更新的数据
     * **/
    async update(where,data){
        try {
            return where&&data&&JuristDb.update(where,data);
        }catch (e) {
            throw e;
        }
    }
    /**
     * @namespace remove 删除一条数据
     * @param where 要删除的目标对象
     * **/
    async remove(where){
        try {
            return where&&JuristDb.remove(where);
        }catch (e) {
            throw e;
        }
    }
}
module.exports = new Jurist();