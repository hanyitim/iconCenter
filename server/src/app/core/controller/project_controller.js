import {projectBll} from '../bll/index.js';

export async function add(ctx){
    ctx.checkBody({
        name:{
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
        let bll = await projectBll.add(ctx.request.body);
        ctx.body = bll
    }
}


export async function remove(ctx){
    ctx.check({
        _id:{
            in:'query',
            notEmpty: true,
            isId:true
        },
        name:{
            in:'query',
            notEmpty: true
        }
    });
    let errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let bll = await projectBll.remove(ctx.request.query);
        ctx.body = bll;
    }
}

export async function update(ctx){
    ctx.check({
        _id:{
            in:'body',
            notEmpty: true,
        },
        name:{
            in:'body',
            notEmpty: true
        }
    });
    let errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let bll = await projectBll.update(ctx.request.body);
        ctx.body = bll;
    }
}

export async function list(ctx){
    let bll = await projectBll.list(ctx.request.body);
    ctx.body = bll;
}

export async function iconOperate(ctx){
    const bll = await projectBll.iconOperate(ctx.request.query);
    ctx.body = bll;
}

