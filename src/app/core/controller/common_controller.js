import fs from 'fs';
import { commonBll } from '../bll/index.js';

export async function upload(ctx){
    let {file} = ctx.request.files;
    if(file){
        let renameResult = fs.renameSync(file.path,file.path.replace(/(?<=upload\/)\w*/,file.name));
        if(renameResult){
            fs.unlinkSync(file.path);
        }
        ctx.body = !renameResult ? {
            rCode:0,
            data:{
                path:`/upload/${file.name}`,
                host:process.env.HOST,
            },
            msg:'success'
        }:{
            rCode:-1,
            msg:'文件保存失败'
        };
    }else{
        ctx.body = {
            rCode:-1,
            mas:'文件不存在'
        };
    }
};

export async function dist(ctx){
    ctx.check({
        'id':{
            in:'body',
            isId:true,
            notEmpty:true
        },
        'type':{
            in:'body',
            notEmpty:true
        },
        'icons':{
            in:'body'
        }
    });
    let errors = await ctx.getValidationResult();
    if(!errors.isEmpty()){
        ctx.body = {
            rCode:-1,
            errors:errors.array()
        };
    }else{
        let bll = await commonBll.dist(ctx.request.body);
        ctx.body = bll;
    }
}