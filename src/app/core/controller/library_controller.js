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
        ctx.body = bll
    }
}


export async function deleteLibrary(ctx){
    ctx.check({
        id:{
            in:'params',
            notEmpty: true,
            isId:true
        },
        name:{
            in:'query',
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
        let bll = await libraryBll.deleteLibrary({...ctx.request.query,...ctx.params});
        ctx.body = bll;
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
        ctx.body = bll;
    }
}

export async function libraryList(ctx){
    let bll = await libraryBll.libraryList(ctx.request.body);
    ctx.body = bll;
}

