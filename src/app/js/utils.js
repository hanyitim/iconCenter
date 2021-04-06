import mongoose from 'mongoose';
import cheerio from 'cheerio';
import fs from 'fs';
import { join as pathJoin } from 'path';
import {OPERATION_BIND, OPERATION_UN_BIND, LIST_BY_LIBRARYID, LIST_BY_PROJECTID} from './config.js';
import svgpath from 'svgpath';

const cwd = process.cwd();
const baseWidth = 1024;

function parsePath($path,scale){
    let paths = [];
    $path.each((index,path)=>{
        let d = path.attribs.d;
        paths.push(d.replace(/[\d\.]+/g,(num)=>(num * scale).toFixed(8)));
    });
    return paths;
}
function mirrorImagePath(paths,height){
    return paths.map((path)=>svgpath(path).matrix([1,0,0,-1,0,0]).matrix([1,0,0,1,0,height]).toString());
}
function parseG($g){
    let tags = [];
    $g.each((index,g)=>{
        let id = g.attribs.id;
        tags.push(id);
    })
    return tags;
}
function customValidators(){
    const isId = (value)=>mongoose.Types.ObjectId.isValid(value);
    const isFontName = (value)=>/[a-zA-Z0-9\_]+/.test(value);
    const isOperation = (value)=> [OPERATION_BIND,OPERATION_UN_BIND].indexOf(parseInt(value)) > -1;
    const isIconListType = (value) => [LIST_BY_LIBRARYID, LIST_BY_PROJECTID].indexOf(parseInt(value)) > -1;
    return {
        isId,
        isFontName,
        isOperation,
        isIconListType
    }
}
function parseType(type){
    return (param) => {
        return `${Object.prototype.toString.call(param).toLocaleLowerCase()}`.slice(8,-1) === type.toLocaleLowerCase();
    };
}

export function parseFile(paths,type,libraryId){
    let icons = [];
    const parseIcons = (path) => {
        let filePath = pathJoin(cwd,'/src/assets/static/',path),
            icons = [];
        if(fs.existsSync(filePath)){
            let htmlStr,
                $,
                selection;
            if(type !== 'json'){
                htmlStr = fs.readFileSync(filePath,{encoding:'utf-8'});
                $ = cheerio.load(htmlStr);
            }else{
                
                selection = fs.readFileSync(filePath,{encoding:'utf-8'});
            }
            switch(type){
                case 'svg':{
                    let $svg = $('svg:first'),
                        $g = $svg.find('g'),
                        $path = $svg.find('path'),
                        width = $svg.attr('width'),
                        height = $svg.attr('height');
                    const scale = baseWidth/parseInt(width);
                    let paths = parsePath($path,scale);
                    icons.push({
                        width:baseWidth,
                        height:parseInt(height) * scale,
                        paths,
                        mirrorImagePaths:mirrorImagePath(paths,height),
                        tags:parseG($g),
                        libId:libraryId,
                        name:randomWord(8),
                        projectIds:[]
                    });
                    return icons;
                }
                case 'glyph':{
                    let $fontface = $('font-face:first'),
                        $glyph = $('glyph'),
                        width = $fontface.attr('units-per-em'),
                        height = width;
                    const scale = baseWidth/parseInt(width);
                    $glyph.each((index,glyph)=>{
                        let {attribs} = glyph;
                        if(attribs.d && attribs.d.length > 0){
                            icons.push({
                                width:baseWidth * scale,
                                height:parseInt(height) * scale,
                                paths:[attribs.d],
                                mirrorImagePaths:mirrorImagePath([attribs.d],parseInt(height) * scale),
                                name:attribs['glyph-name'] || randomWord(8),
                                code: attribs['unicode'] ? attribs['unicode'].charCodeAt() : null,
                                projectIds:[]
                            })
                        }
                    });
                    return icons
                }
                case 'json':{
                    let data = JSON.parse(selection);
                    if(data && data.icons){
                        let {icons:iconList,height} = data;
                        icons = iconList.map(({icon,properties})=>{
                            return {
                                width:height,
                                height,
                                paths:icon.paths,
                                mirrorImagePaths:mirrorImagePath(icon.paths,height),
                                tags:icon.tags.join(','),
                                code:properties.code,
                                name:properties.name || randomWord(8),
                                projectIds:[],
                                libId:libraryId
                            };
                        });
                    }
                    return icons;
                }
            }
        }else{
            return [];
        }
    }
    paths.forEach((path)=>{
        icons = icons.concat(parseIcons(path))
    });
    return Promise.resolve(icons);
}
export const isString = parseType('string');
export const isObject = parseType('object');
export const validators = customValidators();


export function randomWord(length){
    let words = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        wordsLength = words.length
    let word = '',
        count = 0
    while(count < length){
        word += count === 0 ? words[parseInt(Math.random() * (wordsLength -1 - 10))] : words[parseInt(Math.random() * (wordsLength -1))];
        count++;
    }
    return word;
}