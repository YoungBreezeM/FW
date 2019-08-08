let MongoClint = require('mongodb').MongoClient;
let config = require('../config/config').DB;
let url = 'mongodb://'+config.host+':'+config.port+'/';
/**
 * @param connect 数据库连接
 * @param col 集合名
 * @param callback 数据回调
 * **/
let connect = (col,callback)=>{
    //打开数据库
    MongoClint.connect(url,{useNewUrlParser:true}, (err, db)=>{
        if (err)
            throw err;
        else{
            col = db.db(config.db).collection(col);
            callback(col,db);
        }

    })
}
let promise = (col,fn)=>{
    return new Promise((resolve, reject)=>{//创建有个许诺构造器
        //打开数据库集合
        connect(col, (col,db)=> {
            fn(resolve,reject,col,db);
        });

    });
}
//数据操作结果
let finall = (resolve,reject,db,err,result)=>{
    if(err)
        reject(err);
    else
        resolve(result)
    //    关闭数据库
    db.close();
}
//数据库操作集合
let col =(col)=>{
    let find =(data) =>{//查找
        return promise(col,(resolve,reject,col,db)=>{
            // 查找元素
            col.find(data).toArray((err,result) =>{
                //处理结果
                finall(resolve,reject,db,err,result)
            });
        })
    }
    let insert = (data)=> {
        return promise(col,(resolve,reject,col,db)=> {
            //插入元素
            col.insertOne(data,(err,result)=> {
                //处理结果
                finall(resolve,reject,db,err,result);
            });
        })
    }
    let update = function (where,data) {
        return promise(col,(resolve, reject,col,db)=> {
                // 更新元素
                col.updateOne(where,{$set:data}, (err,result)=> {
                    //处理结果
                    finall(resolve,reject,db,err,result)
                })
        })
    }
    let remove = (where)=>{
        return promise(col,(resolve, reject,col,db)=> {
            // 删除元素
            col.deleteMany(where,(err,result) =>{
                finall(resolve,reject,db,err,result);
            });
        })
    }
    return {
        find:find,
        insert:insert,
        update:update,
        remove:remove,}//解构赋值
}
module.exports =col;


