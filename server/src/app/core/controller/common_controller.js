import fs from 'fs';
import { commonBll } from '../bll/index.js';
import mineType from '../../js/mimeType.js';
import { join as pathJoin } from 'path';

const cwd = process.cwd();
const uploadPath = pathJoin(cwd,'./src/assets/static/upload');
if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath);
}
export async function upload(ctx){
    let {file} = ctx.request.files;
    if(file){
        if(!mineType[file.type]){
            return ctx.body = {
                rCode:1,
                msg:'资源格式不合法'
            };
        }
        let renameResult = fs.renameSync(file.path,`${file.path}${mineType[file.type]}`);
        if(renameResult){
            fs.unlinkSync(file.path);
        }
        ctx.body = !renameResult ? {
            rCode:0,
            data:{
                path:`/upload/${file.path.replace(/.*\//g,'')}${mineType[file.type]}`
            },
            msg:'success'
        }:{
            rCode:-1,
            msg:'文件保存失败'
        };
    }else{
        ctx.body = {
            rCode:-1,
            msg:'文件不存在'
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
        'fontName':{
            in:'body',
            isFontName:true,
            notEmpty:true
        },
        'icons':{
            in:'body',
        },
        'type':{
            in:'body',
            notEmpty:true
        },
        'prefix':{
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
        let bll = await commonBll.dist({...ctx.request.body});
        ctx.body = bll;
    }
}