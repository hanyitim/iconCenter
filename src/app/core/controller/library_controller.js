import {libraryBll} from '../bll/index.js';

export async function postLibraryAdd(ctx){
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


export async function removeLibrary(ctx){
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
        let bll = await libraryBll.removeLibrary({...ctx.request.body,...ctx.params});
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
