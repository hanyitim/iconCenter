import {projectModel} from '../models/index.js';
import * as dbHelper from './dbHelper.js';
import {isObject, isString, validators} from '../../js/utils.js';

export async function add(project){
    let newProject = await dbHelper.addData(projectModel,project);
    return newProject;
}

export async function remove(_id){
    let project = await dbHelper.removeData(projectModel,{_id:_id});
    return project;
}

export async function update(_id, update){
    let project = await dbHelper.updateData(projectModel,{_id:_id},update);
    return project;
}

export async function find(conditions){
    let project = await dbHelper.findData(projectModel,conditions);
    return project;
}
