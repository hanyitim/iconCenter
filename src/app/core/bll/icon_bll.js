import {iconDal} from '../dal/index.js';
import {validators} from '../../js/utils.js';

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

export async function iconList(libId){
    let icons = await iconDal.findIcon({libId});
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