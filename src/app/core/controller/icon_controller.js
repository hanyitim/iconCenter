
import {parseFile} from '../../js/utils.js';
import {iconBll} from '../bll/index.js';

export async function iconAdd(ctx){
    debugger;
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
        let {path:filePath, type, libraryId} = ctx.request.body;
        let icons = await parseFile(filePath, type, libraryId);
        let data = await iconBll.addIcon(icons);
        console.log(data);
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
        let bll = await iconBll.deleteIcon(...ctx.params);
        ctx.body = {
            rCode: bll.isSuccess ? 0 : -1,
            msg:bll.msg
        }
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
        ctx.body = {
            rCode: bll.isSuccess ? 0 : -1,
            msg:bll.msg
        }
    }
}



