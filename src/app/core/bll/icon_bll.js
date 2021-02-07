import {iconDal} from '../dal/index.js';

export async function addIcon(icons){
    let {msg, isSuccess} = await iconDal.addIcons(icons);
    return {
        msg,
        isSuccess
    };
}


export async function deleteIcon(id){
    let {msg, isSuccess} = await iconDal.deleteIcon(id);
    return {
        msg,
        isSuccess
    };
}

export async function updateIcon({id,...data}){
    let {msg, isSuccess} = await iconDal.updateIcon(id,data)
    return {
        msg,
        isSuccess
    };
}