import {libraryDal} from '../dal/index.js';

export async function addLibrary(data){
    let {msg, isSuccess} = await libraryDal.addLibrary(data);
    return {
        msg,
        isSuccess
    };
}

export async function removeLibrary(data){
    let {msg, isSuccess} = await libraryDal.removeLibrary(data);
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