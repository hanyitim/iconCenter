import {iconModel} from '../models/index.js';
import {isObject, isString, validators} from '../../js/utils.js';


export async function addIcons(icons){
    let newIcons = await iconModel.insertMany(icons);
    return newIcons;
}

export async function findIcon(body,isFindOne=false){
    let query,
        queryData;
    if(isString(body) && validators.isId(body)){
        query = iconModel.findById(body);
    }
    else if(isObject(body)){
        query = isFindOne ? iconModel.findOne(body) : iconModel.find(body)
    }
    if(query && query.exec){
        queryData = await query.exec();
    }
    return queryData;
}

export async function deleteIcon(id){
    let icon;
    if(validators.isId(id)){
        icon = await iconModel.findByIdAndRemove(id);
    }
    return icon;
}

export async function updateIcon(id,update){
    let query = iconModel.findByIdAndUpdate(id,update),
        queryData = await query.exec();
    return queryData;
}

export async function updateIcons(icons,update){
    debugger;
    let query = iconModel.updateMany(icons,update),
        queryData = await query.exec();
    return queryData;
}