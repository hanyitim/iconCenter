import {libraryModel} from '../models/index.js';



export async function addLibrary(data){
    let query = libraryModel.findOne({name:data.name}),
        queryData = await query.exec(),
        rData = {};
    if(!queryData){
        let library = new libraryModel(data),
            model = await library.save();
        rData.isSuccess = model ? true : false;
        rData.msg = '操作成功';
    }else{
        rData.msg = `${data.name},该字体库已存在`
    }
    return rData;
}

export async function removeLibrary({id,name}){
    let query = libraryModel.findById(id),
        queryData = await query.exec(),
        rData = {msg:''};
    if(!queryData){
        rData.msg = '字体id不找不到';
    }
    else if(queryData && queryData.name !== name){
        rData.msg = '字体名称不正确';
    }
    else{
        debugger;
        let libraryData = await query.deleteOne();
        console.log('libraryData',libraryData);
        if(!libraryData.deletedCount){
            rData.msg = '字体库删除失败';
        }else{
            rData.msg = '字体库删除成功';
            rData.isSuccess = true;
        }
    }
    return rData;
}

export async function updateLibrary(id,update){
    let query = libraryModel.findByIdAndUpdate(id,update),
        queryData = await query.exec(),
        rData = {msg:''};
    debugger;
    if(queryData){
        rData.msg = '操作成功';
        rData.isSuccess = true;
    }else{
        rData.errors = queryData;
    }
    return rData;
}

export async function checkLibrary(checkQuery={}){
    let query = JSON.stringify(checkQuery) === '{}' ? libraryModel.find() : libraryModel.find(checkQuery),
        queryData = await query.exec(),
        rData = {};
    
    rData.data = queryData || [];
    rData.isSuccess = true;
    return rData;
}