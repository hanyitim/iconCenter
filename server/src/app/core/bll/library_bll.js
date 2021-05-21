import {libraryDal, iconDal} from '../dal/index.js';
import {validators, randomWord} from '../../js/utils.js';

export async function addLibrary(data){
    let {data:library} = await libraryDal.findLibrary({name:data.name});
    if(!library || (Array.isArray(library) && library.length === 0)){
        let {data:newLibrary,error} = await libraryDal.addLibrary(data);
        return {
            rCode:0,
            data:newLibrary[0].toObject(),
            msg: !error ? '操作成功' : '操作失败'
        };
    }else{
        return {
            rCode:-1,
            msg:'library not empty'
        };
    }
}

export async function deleteLibrary({_id,name}){
    if(!validators.isId(_id)){
        return {
            rCode:-1,
            msg:'library _id 无效'
        };
    }
    let {data:[library],error} = await libraryDal.findLibrary({_id});
    if(library && !error){
        let msg = ''
        if(library.name === name){
            let result = await libraryDal.deleteLibrary({_id});
            msg = result ? '操作成功' :'操作失败';
        }else{
            msg = '名称不正确';
        }
        return {
            rCode:0,
            msg
        };
    }else{
        return {
            rCode:-1,
            msg:'library not found',
            error
        };
    }
}

export async function updateLibrary({_id,...update}){
    if(!validators.isId(_id)){
        return {
            rCode:-1,
            msg:'library _id 无效'
        };
    }
    let {data:result,error} = await libraryDal.updateLibrary(_id,{$set:update});
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

export async function libraryList(data){
    let {data:librarys,error} = await libraryDal.findLibrary(data || {});
    if(error){
        return {
            rCode:-1,
            error
        };
    }else{
        return {
            rCode:0,
            data:librarys
        };
    }
}

export async function libraryDetail(data){
    let {data:[library],error} = await libraryDal.findLibraryRef(data);
    if(error){
        return {
            rCode:-1,
            error
        };
    }else{
        return {
            rCode:0,
            data:library
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
        let {data:newIcons,error} = await iconDal.addIcons(data);
        if(!error){
            let lastCode = library.maxCode,
                length = newIcons.length,
                icons = [];
            newIcons.forEach((icon,index)=>{
                let newIcon = {
                    icon:icon._id,
                    properties:{
                        code: parseInt(lastCode) + index + 1,
                        name:icon.name || randomWord(8)
                    }
                }
                if(icon.code){
                    newIcon.properties.code = icon.code;
                    lastCode = parseInt(icon.code);
                }
                icons.push(newIcon);
            });
            let {data:result,error} = await libraryDal.updateLibrary(_id,data.type === 'svg' ? {
                $inc:{maxCode:length},
                $push:{icons:{$each:icons}}
            } : {
                $set:{maxCode:lastCode},
                $push:{icons:{$each:icons}}
            });
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
            return {
                rCode:-1,
                error
            };
        }
    }
}

export async function iconRemove(_id,iconId){
    let {data:[library],error} = await libraryDal.findLibrary({_id});
    if(error || !library){
        return {
            rCode:-1,
            error,
            msg:'library not found'
        }
    }else{
        let {data:result,error} = await libraryDal.updateLibrary({_id},{
            $pull:{icons:{_id:iconId}}
        });
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

export async function iconSave(_id,data){
    let {data:[library],error} = await libraryDal.findLibrary({_id});
    if(error || !library){
        return {
            rCode:-1,
            error,
            msg:'library not found'
        }
    }else{
        let {data:result,error} = await libraryDal.updateLibrary({_id,icon},{
            $set:{icons:{_id:iconId}}
        });
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