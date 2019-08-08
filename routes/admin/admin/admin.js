let utilFw = require('../../../bin/util/util_fw');
let Db = require('../../../bin/db/db'),
    Admins = Db('Admins');




let admin =class  {
    constructor(){

    }
    /**
     * @namespace toTurn 根据指定数据格式转化数据
     * @param target 数据源
     * @param model 数据模板
     * **/
    async toTurn(target,model){
        if(target&&model){
            if(typeof model=='object'){
                let tModel = utilFw.deepCopy(model);//深度拷贝
                for(let i in tModel){
                    if(i in target){
                        tModel[i] = target[i];
                    }
                }
                return await tModel;
            }else {
                throw new Error('target and model type cant Object')
            }
        }else {
            throw new Error('target and model cant empty')
        }
    }
    /**
     * @namespace getData 获取对象数据
     * @param v 要获取的数据对象
     * **/
    async getData(v={}){
        try {
            return await Admins.find(v);
        }catch (e) {
            throw e;
        }
    }
    /**
     * @namespace insert 插入一条数据
     * @param target 要插入的数据对象
     * **/
    async insert(target){
        try {
            return await Admins.insert(target);
        }catch (e) {
            throw e;
        }
    }
    /**
     * @namespace remove 删除一条数据
     * @param target 要删除的数据对象
     * **/
    async remove(target){
       try{
           return Admins.remove(target);
       }catch (e) {
           throw e;
       }
    }
    /**
     * @namespace update 更新一条信息
     * @param where 要更新的目标
     * @param data 要更新的数据
     * **/
    async update(where,data){
        try {
            return Admins.update(where,data);
        }catch (e) {
            throw e;
        }
    }
}
module.exports = new admin();