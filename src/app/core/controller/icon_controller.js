
import {parseFile} from '../../js/utils.js';
import {iconBll} from '../bll/index.js';

export async function iconAdd(ctx){
    ctx.checkBody({
        'type':{
            notEmpty: true
        },
        'path':{
            notEmpty: true
        },
        'libId':{
            notEmpty: true,
            isId: true
        }
    });
    let  errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let {path:filePath, type, libId} = ctx.request.body;
        let icons = await parseFile(filePath, type, libId);
        let bll = await iconBll.addIcon(icons);
        ctx.body = bll;
    }
}

export async function deleteIcon(ctx){
    ctx.check({
        id:{
            in:'params',
            notEmpty: true,
        }
    });
    let errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let bll = await iconBll.deleteIcon(ctx.params.id);
        ctx.body = bll;
    }
}
export async function updateIcon(ctx){
    ctx.check({
        id:{
            in:'params',
            notEmpty: true,
        }
    });
    let errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let bll = await iconBll.updateIcon({...ctx.request.body,...ctx.params});
        ctx.body = bll;
    }
}

export async function iconList(ctx){
    ctx.check({
        libId:{
            in:'params',
            notEmpty:true,
            isId:true
        }
    });
    let errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let bll = await iconBll.iconList(ctx.params.libId);
        ctx.body = bll;
    }
}


