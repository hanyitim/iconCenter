import {libraryBll} from '../bll/index.js';

export async function addLibrary(ctx){
    ctx.checkBody({
        name:{
            notEmpty: true,
            isFontName: true
        },
        desc:{
            notEmpty: true
        },
        owner:{
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
        let bll = await libraryBll.addLibrary(ctx.request.body);
        ctx.body = {
            rCode: bll.isSuccess ? 0 : -1,
            msg:bll.msg
        }
    }
}


export async function deleteLibrary(ctx){
    ctx.check({
        id:{
            in:'params',
            notEmpty: true,
        },
        name:{
            in:'body',
            notEmpty: true,
            isFontName: true
        }
    });
    let errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let bll = await libraryBll.deleteLibrary({...ctx.request.body,...ctx.params});
        ctx.body = {
            rCode: bll.isSuccess ? 0 : -1,
            msg:bll.msg
        }
    }
}

export async function updateLibrary(ctx){
    ctx.check({
        id:{
            in:'params',
            notEmpty: true,
        },
        name:{
            isFontName: true
        }
    });
    let errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let bll = await libraryBll.updateLibrary({...ctx.request.body,...ctx.params});
        ctx.body = {
            rCode: bll.isSuccess ? 0 : -1,
            msg:bll.msg
        }
    }
}

export async function checkLibrary(ctx){
    let bll = await libraryBll.checkLibrary(ctx.request.body);
    ctx.body = {
        rCode: bll.isSuccess ? 0 : -1,
        data: bll.data,
        msg:bll.msg
    }
}

export async function libraryIcons(ctx){
    debugger;
    let bll = await libraryBll.libraryIcons(ctx.params.id);
    ctx.body = {
        rCode: bll.isSuccess ? 0 : -1,
        data: bll.data,
        msg:bll.msg
    }
}
