import {iconDal, libraryDal, projectDal} from '../dal/index.js';
import {validators} from '../../js/utils.js';

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


export async function deleteIcon({ids}){
    ids = ids.split(',');
    if(ids.length > 0){
        let result = await iconDal.deleteIcon(ids);
        return {
            rCode:0,
            msg:result ? '操作成功' : '操作失败'
        };
    }else{
        return {
            rCode:-1,
            msg:'ids length is 0'
        };
    }
}

export async function updateIcon({_id,...update}){
    // if(!validators.isId(_id)){
    //     return {
    //         rCode:-1,
    //         msg:'icon id 无效'
    //     }
    // }

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

export async function iconImport(_id,data){
    let {data:[library],error} = await libraryDal.findLibrary({_id});
    if(error || !library){
        return {
            rCode:-1,
            error,
            msg:'library not found'
        }
    }else{
        // let {data:newIcons,error} = await iconDal.addIcons(data);
        let lastCode = library.maxCode,
            icons = [];
        
        data.forEach((icon)=>{
            if(icon.code){
                lastCode = Math.max(lastCode,parseInt(icon.code));
            }else{
                lastCode +=1;
                icon.code;
            }
            icons.push(icon);
        });
        let {error:iconError} = await iconDal.addIcons(data);
        if(iconError){
            return {
                rCode:-1,
                error:iconError
            };
        }
        let {data:result,error} = await libraryDal.updateLibrary(_id,{$set:{maxCode:lastCode}});
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
}

export async function iconList(data){
    
    let {data:list,error} = await iconDal.findIcons(data);
    if(error){
        return {
            rCode:-1,
            error
        }
    }else{
        return {
            rCode:0,
            data:list
        }
    }
}

export async function iconAbandon({remove}){
    let {data:result,error} = await iconDal.abandonIcon(remove);
    if(remove){
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
    }else{
        if(error){
            return {
                rCode:-1,
                error
            }
        }else{
            return {
                rCode:0,
                data:result
            }
        }
    }
}

export async function iconOperatePID({pId,ids,operate}){
    let {data:[project],error} = await projectDal.find({_id:pId});
    if(error || !project){
        return {
            rCode:-1,
            error,
            msg:'project not found'
        }
    }else{
        ids = ids.split(',');
        const {data:result,error} = await iconDal.operatePID(ids,pId,operate);
        if(error || result.n === 0){
            return {
                rCode:-1,
                msg:'操作失败',
                error
            };
        }else{
            return {
                rCode:0,
                msg:'操作成功'
            };
        }
    }
}