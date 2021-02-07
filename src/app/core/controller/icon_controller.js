
import {parseFile} from '../../js/utils.js';
import {iconBll} from '../bll/index.js';

export function getIconInfo(ctx){
    const icon_id = ctx.params.icon_id;
    // const user = await userBll.getByName(userName);
    ctx.body = icon_id;
};

export async function postIconAdd(ctx){
    ctx.checkBody({
        'type':{
            notEmpty: true
        },
        'path':{
            notEmpty: true
        },
        'libraryId':{
            notEmpty: true
        }
    });
    let  errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let {path:filePath, type} = ctx.request.body;
        let config = await parseFile(filePath,type);
        let data = await iconBll.addIcon(config);
        console.log(data);
    }
    ctx.body = JSON.stringify(ctx.request.body);
}

export function postIconInfo(ctx){
    const icon_id = ctx.params.icon_id;
    ctx.body = icon_id;
}


