import {libraryDal} from '../dal/index.js';

export async function addLibrary(data){
    let {msg, isSuccess} = await libraryDal.addLibrary(data);
    return {
        msg,
        isSuccess
    };
}

export async function deleteLibrary(data){
    let {msg, isSuccess} = await libraryDal.deleteLibrary(data);
    return {
        msg,
        isSuccess
    };
}

export async function updateLibrary({id,...data}){
    let {msg, isSuccess} = await libraryDal.updateLibrary(id,data)
    return {
        msg,
        isSuccess
    };
}

export async function checkLibrary(queryData){
    let {msg, data, isSuccess} = await libraryDal.checkLibrary(queryData);
    return {
        msg,
        data,
        isSuccess
    };
}

export async function libraryIcons(libId){
    let {msg, data, isSuccess} = await libraryDal.libraryIcons(libId);
    return {
        msg,
        data,
        isSuccess
    };
}