import {projectBll} from '../bll/index.js';

export async function addProject(ctx){
    ctx.checkBody({
        name:{
            notEmpty: true,
        },
        desc:{
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
        let bll = await projectBll.addProject(ctx.request.body);
        ctx.body = bll
    }
}


export async function deleteProject(ctx){
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
        let bll = await projectBll.deleteProject({...ctx.request.query,...ctx.params});
        ctx.body = bll;
    }
}

export async function updateProject(ctx){
    ctx.check({
        id:{
            in:'params',
            notEmpty: true,
        },
        name:{
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
        let bll = await projectBll.updateProject({...ctx.request.body,...ctx.params});
        ctx.body = bll;
    }
}

export async function projectList(ctx){
    let bll = await projectBll.projectList(ctx.request.body);
    ctx.body = bll;
}

