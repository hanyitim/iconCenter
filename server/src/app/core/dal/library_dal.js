import {libraryModel} from '../models/index.js';
import * as dbHelper from './dbHelper.js';

export async function addLibrary(library){
    let newLibrary = await dbHelper.addData(libraryModel,library);
    return newLibrary;
}

export async function deleteLibrary(_id){
    let library = await dbHelper.removeData(libraryModel,{_id:_id});
    return library;
}

export async function updateLibrary(_id, update){
    let library = await dbHelper.updateData(libraryModel,{_id:_id},update);
    return library;
}

export async function findLibrary(conditions){
    let library = await dbHelper.findData(libraryModel,conditions);
    return library;
}

export async function findLibraryRef(...conditions){
    let library = await dbHelper.findDataPopulation(libraryModel,conditions,{path:'icons.icon', select:'-createdAt -updatedAt'});
    return library;
}