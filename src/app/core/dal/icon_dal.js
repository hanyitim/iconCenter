import {iconModel} from '../models/index.js';
import * as dbHelper from './dbHelper.js';


export async function addIcons(icons){
    let newIcons = await dbHelper.addData(iconModel,icons);
    return newIcons;
}

export async function findLibrary(conditions){
    let icons = await dbHelper.findData(iconModel,conditions);
    return icons;
}

export async function deleteIcon(_id){
    let icon = await dbHelper.removeData(iconModel,{_id:_id});
    return icon;
}


export async function updateIcon(_id, update){
    let icon = await dbHelper.updateData(iconModel,{_id:_id},{$set:update});
    return icon;
}
