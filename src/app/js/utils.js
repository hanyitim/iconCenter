import mongoose from 'mongoose';
import cheerio from 'cheerio';
import fs from 'fs';
import { join as pathJoin } from 'path';
import {OPERATION_BIND, OPERATION_UN_BIND, LIST_TYPE_LIBRARY, LIST_TYPE_PROJECT} from './config.js';

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
export function transformPath(paths,width){
    return paths.map((path)=>path.replace(/[\d\.]+/g,(num)=>(num * width/baseWidth).toFixed(8)));
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
    const isIconListType = (value) => [LIST_TYPE_LIBRARY, LIST_TYPE_PROJECT].indexOf(parseInt(value)) > -1;
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

export function parseFile(path,type,libraryId){
    let filePath = pathJoin(cwd,'/src/assets/static/',path),
        icons = [];
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
                icons.push({
                    width:baseWidth,
                    height:parseInt(height) * scale,
                    paths:parsePath($path,scale),
                    tags:parseG($g),
                    libId:libraryId
                });
                return Promise.resolve(icons);
            }
            // case 'glyph':{
            //     let 
            // }
        }
    }else{
        return Promise.reject({msg:`${path}，文件不存在`});
    }
}
export const isString = parseType('string');
export const isObject = parseType('object');
export const validators = customValidators();


export const randomWord = (length)=>{
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