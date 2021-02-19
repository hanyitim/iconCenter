import {iconDal} from '../dal/index.js';
import {validators} from '../../js/utils.js';
import {OPERATION_BIND, OPERATION_UN_BIND, LIST_TYPE_LIBRARY, LIST_TYPE_PROJECT} from '../../js/config.js';

export async function addIcon(icons){
    let newIcons = await iconDal.addIcons(icons);
    if(icons.length === newIcons.length && newIcons.length > 0){
        return {
            rCode:0
        };
    }else{
        return {
            rCode:-1,
            msg:'addIcon error'
        };
    }
}

export async function iconList({id, type}){
    let icons = await iconDal.findIcon( LIST_TYPE_LIBRARY == type ? {libId:id}:{
        projectIds:id
    });
    return {
        rCode:0,
        data:icons
    };
}

export async function deleteIcon(id){
    let icon = await iconDal.findIcon(id);
    console.log(icon);
    if(icon){
        let result = await iconDal.deleteIcon(id);
        return {
            rCode:0,
            msg:result ? '操作成功' : '操作失败'
        };
    }else{
        return {
            rCode:-1,
            msg:'icon not found'
        };
    }

}

export async function updateIcon({id,...data}){
    if(!validators.isId(id)){
        return {
            rCode:-1,
            msg:'icon id 无效'
        }
    }
    let icon = await iconDal.findIcon(id);
    if(icon){
        await iconDal.updateIcon(id,data);
        return {
            rCode:0,
            msg:'操作成功'
        }
    }else{
        return {
            rCode:-1,
            msg:'icon not found'
        }
    }
}

export async function iconToProjectOperation({pId,iconId,operation}){
    if(!validators.isId(pId)){
        return {
            rCode:-1,
            msg:'project not found'
        };
    }
    if(!validators.isId(iconId)){
        return {
            rCode:-1,
            msg:'iconId not found'
        };
    }
    let projectIds = [];
    let icon = icon.findIcon(iconId);
    if(icon.projectIds){
        projectIds = projectIds.concat(icon.projectIds);
    }
    let projectIdIndex = icon.projectIds.indexOf(id); 
    if(operation === OPERATION_BIND && projectIdIndex < 0){
        projectIds.push(id);
    }
    else if(operation === OPERATION_UN_BIND && projectIdIndex > -1){
        projectIds.splice(projectIdIndex,1);
    }
    return await updateIcon(iconId,{projectIds});
}