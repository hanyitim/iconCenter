import {libraryModel} from '../models/index.js';
import {isObject, isString, validators} from '../../js/utils.js';


// export async function addLibrary(data){
//     let query = libraryModel.findOne({name:data.name}),
//         queryData = await query.exec(),
//         rData = {};
//     if(!queryData){
//         let library = new libraryModel(data),
//             model = await library.save();
//         rData.isSuccess = model ? true : false;
//         rData.msg = '操作成功';
//     }else{
//         rData.msg = `${data.name},该字体库已存在`
//     }
//     return rData;
// }

export async function addLibrary(library){
    let newLibrary = await libraryModel.insertMany(library);
    return newLibrary;
}

export async function deleteLibrary(id){
    let library;
    if(validators.isId(id)){
        library = await libraryModel.findByIdAndRemove(id);
    }
    return library;
}

export async function updateLibrary(id, update){
    let query = libraryModel.findByIdAndUpdate(id,update),
        queryData = await query.exec();
    debugger;
    return queryData;
}

export async function findLibrary(body,isFindOne=false){
    let query,
        queryData;
    if(isString(body) && validators.isId(body)){
        query = libraryModel.findById(body);
    }
    else if(isObject(body)){
        query = isFindOne ? libraryModel.findOne(body) : libraryModel.find(body)
    }
    if(query && query.exec){
        queryData = await query.exec();
    }
    return queryData;
}
