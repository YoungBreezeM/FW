let Db = require('../../../bin/db/db'),
    Roles = Db('Roles'),
    jurisdiction =Db('jurisdiction');
let uitlFw = require('../../../bin/util/util_fw');

let role = class {
    constructor() {

    }

    /**
     * @namespace getData 获取数据
     * **/
    async getData(v = {}) {
        try {
            return await Roles.find(v)
        } catch (e) {
            throw e;
        }
    }

    /**
     * @namespace remove 删除一条信息
     * @param target 要删除的目标对象
     * **/
    async remove(target) {
        try {
            return Roles.remove(target);
        } catch (e) {
            throw e;
        }
    }

    /**
     * @namespace deleteKet 删除指定键值
     * @param target 要删除的源数据
     * @param keycol 要删除的键值集合
     * **/
    async deleteKet(target, keycol) {
        let stack = uitlFw.deepCopy(target);//深度拷贝对象
        stack.find(value => {
            keycol.forEach(val => {//删除指定值
                delete value[val];
            })
        })
        return stack;
    }

    /**
     * @namespace toArray 将键后面的值转化为array类型
     * @param data 要转化的目标数据
     * **/
    async toArray(data) {
        //数据类型转化
        for (let i in data) {//转化成数组
            if (typeof data[i] == 'string') {
                data[i] = [data[i]];
            }
        }
        return data;
    }

    /**
     * @namespace synthetic 合成标准数据
     * @param data 想要合成的数据源
     * @param model 想要合成的模板格式
     * @param 返回模板数据必须放在函数内，可以做到没次都初始化
     * @param tomodel 把model模型放入tomodel中
     * **/
    async synthetic(data, model, toModel) {//合成数据
        if (data && model) {
            let t = uitlFw.deepCopy(model);
            if (t instanceof Object) {//模型只能是对象
                if (toModel) {//tomodel 模型只能是数组
                    let tomodel = uitlFw.deepCopy(toModel);
                    if (tomodel instanceof Array && Object) {
                        for (let i in data) {
                            if(i in t){
                                for (let j in data[i]) {
                                    if (!tomodel[j]) {//判断目标模型是否为空
                                        let d = uitlFw.deepCopy(model);
                                        d[i] = data[i][j];
                                        tomodel.push(d)
                                    } else {
                                        tomodel[j][i] = data[i][j];
                                    }
                                }
                            }

                        }
                        return tomodel;
                    } else {
                        throw new Error('tomodel is not Array')
                    }
                } else {
                    for (let i in data) {
                        if (i in t) {//如果数据里面的键在模型中
                            t[i] = data[i];
                        }
                    }
                }
            }
            return t;
        } else {
            throw new Error('data or model cant empty')
        }

    }
    /**
     *@namespace isHasOp 用来判断模型键在数据中的值属于哪个目标对象的
     * @param data 数据源
     * @param model 数据模型
     * @param target 目标对象
     * @param op 要判断的对象
     * **/
    async isHasOp(data,model,target,op){
        if(data&&model&&target&&op){//执行操作
            for(let i in model){
                for(let j in model[i][op]){
                    if(j in data){
                        for(let k in data[j]) {
                            if(data[j][k] == model[i][target]){
                               model[i][op][j]= data[j][k];
                               break;
                            }
                        }
                    }
                }
            }
            for(let i in model[op]){
                console.log(data,i)
                if(i in data){
                    for(let j in data[i]){
                        for (let k in model){
                            console.log(model[k][target],data[i][j])
                            // if(model[k][target]==data[i][j]){
                            //     model[k][op][i] = data[i][j]
                            //     break;
                            // }
                        }
                    }
                }
            }
            return model;
        }else {
            throw new Error("data or model or target cant empty")
        }

    }
    /**
     * @namespace resolver 用于解析指定的数据对象
     * @param target 要解析的目标对象
     * @param key 要解析的键值
     * @param toKey 要解析成的键
     * **/
    async resolver(target, key, toKey) {
        if (target && key && toKey) {
            if (toKey instanceof Array && Object) {
                if (key in target) {
                    if (typeof target[key] == 'string') {//是字符串处理
                        target[toKey[1]] = target[key].match(/([^/]+)$/)[1];
                        target[toKey[0]] = target[key].replace(/([/][^/]+)$/, "");
                    } else if (target[key] instanceof Array && Object) {//是数组处理
                        let stack = {};
                        stack[toKey[0]] = [];
                        stack[toKey[1]] = [];
                        for (let i in target[key]) {
                            stack[toKey[1]][i] = target[key][i].match(/([^/]+)$/)[1];
                            stack[toKey[0]][i] = target[key][i].replace(/([/][^/]+)$/, "");
                        }
                        delete target[key];//删除旧数据
                        for (let i in stack) {//复制新数据
                            target[i] = stack[i];
                        }
                    }
                }

            } else {
                throw new Error('toKey is not a Array')
            }
        }else {
            throw new Error('resolver () var is not empty')
        }
        return target;

    }
    /**
     * @namespace insert 插入一条数据
     * @param data 要插入的数据
     * **/
    async insert(data){
        if(data){
            return Roles.insert(data);
        }else {
            throw new Error('data is cant empty')
        }
    }
    /**
     * @namespace update 更新一条数据
     * @param where 要更新的目标数据
     * @param data 要更新成的数据
     * **/
    async update(where,data){
        if(where&&data){
            return Roles.update(where,data);
        }else {
            throw new Error('where or data cant empty')
        }
    }

}
module.exports = new role();