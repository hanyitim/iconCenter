import cheerio from 'cheerio';
import fs from 'fs';
import { join as pathJoin } from 'path';

const cwd = process.cwd();
const baseWidth = 32;

function parsePath($path,scale){
    let paths = [];
    $path.each((index,path)=>{
        let d = path.attribs.d;
        paths.push(d.replace(/[\d\.]+/g,(num)=>(num * scale).toFixed(8)));
    });
    return paths;
}
function parseG($g){
    let tags = [];
    $g.each((index,g)=>{
        let id = g.attribs.id;
        tags.push(id);
    })
    return tags;
}
export function parseFile(path,type){
    let filePath = pathJoin(cwd,'/src/assets/static/',path),
        config = null;
    if(fs.existsSync(filePath)){
        let htmlStr = fs.readFileSync(filePath,{encoding:'utf-8'}),
            $ = cheerio.load(htmlStr);
        switch(type){
            case 'svg':{
                let $svg = $('svg:first'),
                    $g = $svg.find('g'),
                    $path = $svg.find('path'),
                    width = $svg.attr('width'),
                    height = $svg.attr('height');
                const scale = baseWidth/parseInt(width);
                config = {
                    width:baseWidth,
                    height:parseInt(height) * scale,
                    paths:parsePath($path,scale),
                    tags:parseG($g)
                };
                return Promise.resolve(config);
            }
        }
    }else{
        return Promise.reject({msg:`${path}，文件不存在`});
    }
}

export function customValidators(){
    const isId = (value)=>/[a-z0-9A-Z]+/.test(value);
    const isFontName = (value)=>/[a-zA-Z0-9\_]+/.test(value)
    return {
        isId,
        isFontName
    }
}