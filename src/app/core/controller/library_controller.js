import {libraryBll} from '../bll/index.js';
import {parseFile} from '../../js/utils.js';

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
        _id:{
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
        _id:{
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

export async function libraryDetail(ctx){
    ctx.check({
        '_id':{
            in:'params',
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
        let {_id} = ctx.params;
        let bll = await libraryBll.libraryDetail({_id});
        ctx.body = bll;
    }
}

export async function libraryIconImport(ctx){
    ctx.check({
        'type':{
            notEmpty: true
        },
        'path':{
            notEmpty: true
        },
        '_id':{
            in:'params',
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
        let {path:filePath, type} = ctx.request.body,
            {_id} = ctx.params;
        let icons = await parseFile(filePath, type, _id);
        let bll = await libraryBll.iconImport(_id,icons);
        ctx.body = bll;
    }
}

export async function libraryIconRemove(ctx){
    ctx.check({
        '_id':{
            in:'params',
            notEmpty: true,
            isId: true
        },
        'iconId':{
            in:'query',
            notEmpty:true,
            isId:true
        }
    });
    let  errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let {iconId} = ctx.request.query,
            {_id} = ctx.params;
        let bll = await libraryBll.iconRemove(_id,iconId);
        ctx.body = bll;
    }
}