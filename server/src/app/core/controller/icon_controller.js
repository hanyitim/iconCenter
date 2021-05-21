
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
        let bll = await iconBll.addIcon(icons,libId);
        ctx.body = bll;
    }
}

export async function deleteIcon(ctx){
    ctx.check({
        ids:{
            in:'query',
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
        let bll = await iconBll.deleteIcon(ctx.query);
        ctx.body = bll;
    }
}
export async function updateIcon(ctx){
    ctx.check({
        _id:{
            in:'body',
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
        let bll = await iconBll.updateIcon({...ctx.request.body});
        ctx.body = bll;
    }
}

export async function iconList(ctx){
    ctx.check({
        id:{
            in:'query',
            notEmpty:true,
            isId:true
        },
        type:{
            in:'query',
            notEmpty:true,
            isIconListType:true,
            isInt:true
        }
    });
    
    let errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let bll = await iconBll.iconList(ctx.query);
        ctx.body = bll;
    }
}

export async function iconImport(ctx){
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
        let bll = await iconBll.iconImport(libId,icons);
        ctx.body = bll;
    }
}
export async function iconAbandon(ctx){
    let bll = await iconBll.iconAbandon(ctx.request.body);
    ctx.body = bll;
}

export async function iconOperatePID(ctx){
    ctx.checkBody({
        'pId':{
            notEmpty: true
        },
        'ids':{
            notEmpty: true
        },
        'operate':{
            notEmpty: true
        }
    });
    ctx.body = await iconBll.iconOperatePID(ctx.request.body);
}
