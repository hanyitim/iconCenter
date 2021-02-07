import {iconModel} from '../models/index.js';

// export async function iconList(libId){
//     let query = iconModel.find({libId});
//     let data = await query.exec();
//     return data;
// }

export async function addIcons(icons){
    let newIcons = await iconModel.insertMany(icons),
        rData = {};
    console.log('icons',newIcons);
    if(newIcons.length > 0){
        rData.msg = '操作成功';
        rData.isSuccess = true;
    }else{
        rData.msg = '操作失败';
        rData.isSuccess = false;
    }
    return rData;
}


export async function deleteIcon(id){
    let query = iconModel.findById(id),
        queryData = await query.exec(),
        rData = {msg:''};
    if(!queryData){
        rData.msg = 'icon不找不到';
    }
    else{
        let iconData = await query.deleteOne();
        console.log('iconData',iconData);
        if(!iconData.deletedCount){
            rData.msg = 'icon删除失败';
        }else{
            rData.msg = 'icon删除成功';
            rData.isSuccess = true;
        }
    }
    return rData;
}

export async function updateIcon(id,update){
    let query = iconModel.findByIdAndUpdate(id,update),
        queryData = await query.exec(),
        rData = {msg:''};
    if(queryData){
        rData.msg = '操作成功';
        rData.isSuccess = true;
    }else{
        rData.errors = queryData;
    }
    return rData;

}