import {projectDal} from '../dal/index.js';
import {validators} from '../../js/utils.js';

export async function addProject(project){
    let hasProject = await projectDal.findProject({name:project.name});
    if(!hasProject || (Array.isArray(hasProject) && hasProject.length === 0)){
        let newProject = await projectDal.addProject(project);
        return {
            rCode:0,
            msg: newProject ? '操作成功' : '操作失败'
        };
    }else{
        return {
            rCode:-1,
            msg:'project not empty'
        };
    }
}

export async function deleteProject(data){
    if(!validators.isId(data.id)){
        return {
            rCode:-1,
            msg:'project id 无效'
        };
    }
    let project = await projectDal.findProject(data.id);
    if(project){
        let msg = ''
        if(project.name === data.name){
            let result = await projectDal.deleteProject(data.id);
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

export async function updateProject({id,...data}){
    if(!validators.isId(id)){
        return {
            rCode:-1,
            msg:'project id 无效'
        };
    }
    let project = await projectDal.findProject(id);
    if(project){
        await projectDal.updateProject(id,data);
        return {
            rCode:0,
            msg:'操作成功'
        };
    }else{
        return {
            rCode:-1,
            msg:'project not found'
        };
    }
}

export async function projectList(body){
    let projects = await projectDal.findProject(body || {});
    return {
        rCode:0,
        data:projects
    };
}
