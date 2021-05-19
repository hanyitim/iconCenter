import {iconModel} from '../models/index.js';
import * as dbHelper from './dbHelper.js';
import {LIST_BY_PROJECTID, LIST_BY_LIBRARYID, LIST_BY_ICONID} from '../../js/config.js';
import {isObject} from '../../js/utils.js';

export async function addIcons(icons){
    let newIcons = await dbHelper.addData(iconModel,icons);
    return newIcons;
}

export async function findIcons({id, icons:iconIds, type}){
    if(isObject(iconIds)){
        iconIds = Object.values(iconIds);
    }
    const getConditions = ()=>{
        switch(type - 0){
            case LIST_BY_LIBRARYID:
                return {
                    libId:id
                };
            case LIST_BY_PROJECTID:
                return {
                    projectIds:{
                        $in:[id]
                    }
                };
            case LIST_BY_ICONID:
                return {
                    _id:{
                        $in:iconIds
                    }
                }
        }
    }
    console.log(getConditions());
    let icons = await dbHelper.findData(iconModel,getConditions());
    
    return icons;
}

export async function deleteIcon(_id){
    let icon = await dbHelper.removeData(iconModel,{_id:_id});
    return icon;
}


export async function updateIcon(_id, update){
    let icon = await dbHelper.updateData(iconModel,{_id},{$set:update});
    return icon;
}

export async function abandonIcon(isRemove){
    let icon = isRemove ? await dbHelper.removeData(iconModel,{libId:{$exists:false}}) : await dbHelper.findData(iconModel,{libId:{$exists:false}});
    return icon;
}