import {iconModel, libraryModel} from '../models/index.js';

export async function getIconList(libId){
    let query = iconModel.find({libId});
    let data = await query.exec();
    return data;
}

export async function addIcons(data){
    let newIcon = new IconDbModel(data);
    newIcon.save();
}


export async function deleteIcon(id){
    let query = IconDbModel.findByIdAndDelete(id),
        data = await query.exec();
}

export async function updateIcon(id,data){
    let query = IconDbModel.findByIdAndUpdate(id,data);

}