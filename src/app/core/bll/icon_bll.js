import {iconDal} from '../dal/index.js';

export async function addIcon(data){
    let {data:newIcons,error} = await iconDal.addIcons(data);
    if(icons.length === newIcons.length && newIcons.length > 0){
        return {
            rCode:0,
            data:newIcons[0].toObject(),
            msg: !error ? '操作成功' : '操作失败'
        };
    }else{
        return {
            rCode:-1,
            msg:'addIcon error'
        };
    }
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

export async function updateIcon({_id,...update}){
    if(!validators.isId(_id)){
        return {
            rCode:-1,
            msg:'icon id 无效'
        }
    }
    let {data:result,error} = await iconDal.updateIcon(_id,update);
    if(error || result.n === 0){
        return {
            rCode:-1,
            msg:'操作失败',
            error:error
        };
    }else{
        return {
            rCode:0,
            msg:'操作成功'
        };
    }
}