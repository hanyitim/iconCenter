import {libraryDal} from '../dal/index.js';
import {svg2font} from '../../js/svg2font/index.js';
import mongoose from 'mongoose';

export async function dist({id, type, icons}){
    let conditions = [
        {_id:id}
    ];
    //The $elemMatch operator limits the contents of an <array> field from the query results to contain only the first element matching the $elemMatch condition.
    //注意 only the first element 也就是仅仅匹配第一个合适的元素。那么 对于数组中只有一个返回元素，我们可以使用$elemMatch来查询，但是对于多个元素$elemMatch 是不适应
    // if(icons && icons.length > 0 ){
    //     // icons = icons.map((iconId)=>mongoose.Types.ObjectId(iconId));
    //     conditions.push({
    //         "icons":{
    //             $elemMatch:{
    //                 "_id":{$in:icons}
    //             }
    //         },
    //         // "name":1,
    //         // "_id":0
    //     });
    // }
    let {data:[library],errors} = await libraryDal.findLibraryRef(...conditions);
    if(library){
        let dist = new svg2font(library.toObject(),icons);
        return dist.getZip();
    }
}