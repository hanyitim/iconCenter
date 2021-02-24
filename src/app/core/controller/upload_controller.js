import fs from 'fs';

export async function upload(ctx){
    debugger;
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