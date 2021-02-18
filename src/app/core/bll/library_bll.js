import {libraryDal} from '../dal/index.js';
import {validators} from '../../js/utils.js';

export async function addLibrary(library){
    debugger;
    let hasLibrary = await libraryDal.findLibrary({name:library.name});
    if(!hasLibrary || (Array.isArray(hasLibrary) && hasLibrary.length === 0)){
        let newLibrary = await libraryDal.addLibrary(library);
        return {
            rCode:0,
            msg: newLibrary ? '操作成功' : '操作失败'
        };
    }else{
        return {
            rCode:-1,
            msg:'library not empty'
        };
    }
}

export async function deleteLibrary(data){
    if(!validators.isId(data.id)){
        return {
            rCode:-1,
            msg:'library id 无效'
        };
    }
    let library = await libraryDal.findLibrary(data.id);
    if(library){
        let msg = ''
        if(library.name === data.name){
            let result = await libraryDal.deleteLibrary(data.id);
            msg = result ? '操作成功' :'操作失败';
        }else{
            msg = '名称不正确';
        }
        return {
            rCode:0,
            msg
        };
    }else{
        return {
            rCode:-1,
            msg:'library not found'
        };
    }
}

export async function updateLibrary({id,...data}){
    if(!validators.isId(id)){
        return {
            rCode:-1,
            msg:'library id 无效'
        };
    }
    let library = await libraryDal.findLibrary(id);
    if(library){
        await libraryDal.updateLibrary(id,data);
        return {
            rCode:0,
            msg:'操作成功'
        };
    }else{
        return {
            rCode:-1,
            msg:'library not found'
        };
    }
}

export async function libraryList(body){
    let librarys = await libraryDal.findLibrary(body || {});
    return {
        rCode:0,
        data:librarys
    };
}
