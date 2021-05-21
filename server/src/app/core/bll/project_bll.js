import {projectDal} from '../dal/index.js';
import {validators} from '../../js/utils.js';

export async function add(data){
    let {data:project} = await projectDal.find({name:data.name});
    if(!project || (Array.isArray(project) && project.length === 0)){
        let {data:newProject,error} = await projectDal.add(data);
        return {
            rCode:0,
            data:newProject[0].toObject(),
            msg: !error ? '操作成功' : '操作失败'
        };
    }else{
        return {
            rCode:-1,
            msg:'project not empty'
        };
    }
}

export async function remove({_id,name}){
    if(!validators.isId(_id)){
        return {
            rCode:-1,
            msg:'project id 无效'
        };
    }
    let {data:[project],error} = await projectDal.find({_id});
    if(project && !error){
        let msg = ''
        if(project.name === name){
            let result = await projectDal.remove({_id});
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
            msg:'project not found'
        };
    }
}

export async function update({_id,...update}){
    if(!validators.isId(_id)){
        return {
            rCode:-1,
            msg:'project id 无效'
        };
    }
    let {data:result,error} = await projectDal.update(_id,{$set:update});
    if(error || result.n === 0){
        return {
            rCode:-0,
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

export async function list(body){
    let {data:projects,error} = await projectDal.find(body || {});
    if(error){
        return {
            rCode:-1,
            error
        };
    }else{
        return {
            rCode:0,
            data:projects
        };
    }
}