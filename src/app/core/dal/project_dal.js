import {projectModel} from '../models/index.js';
import {isObject, isString, validators} from '../../js/utils.js';

export async function addProject(project){
    let newProject = await projectModel.insertMany(project);
    return newProject;
}

export async function deleteProject(id){
    let project;
    if(validators.isId(id)){
        project = await projectModel.findByIdAndRemove(id);
    }
    return project;
}

export async function updateProject(id, update){
    let query = projectModel.findByIdAndUpdate(id,update),
        queryData = await query.exec();
    return queryData;
}

export async function findProject(body,isFindOne=false){
    let query,
        queryData;
    if(isString(body) && validators.isId(body)){
        query = projectModel.findById(body);
    }
    else if(isObject(body)){
        query = isFindOne ? projectModel.findOne(body) : projectModel.find(body).sort({_id:-1})
    }
    if(query && query.exec){
        queryData = await query.exec();
    }
    return queryData;
}
