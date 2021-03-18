import fs from 'fs';
import nunjucks from 'nunjucks';
import { join as pathJoin } from 'path';
import svg2ttf from 'svg2ttf';
import ttf2woff from 'ttf2woff';
import {transformPath} from '../utils.js';
import child_process from 'child_process';
const cwd = process.cwd();
export class svg2font {
    static env = new nunjucks.Environment(new nunjucks.FileSystemLoader(pathJoin(cwd,'src/app/js/svg2font/templates')));
    static baseDir = pathJoin(cwd,'src/assets/static/dist');
    constructor(library){
        this.library = library;
        this.init();
    }
    init(){
        let {icons, _id:id, name:fontName} = this.library;
        icons.forEach((item,index)=>{
            let paths = [...item.icon.paths];
            icons[index].icon.paths = transformPath(paths,1024);
        });
        this.data = {
            icons,
            id,
            fontName
        };
        this.distDir = pathJoin(svg2font.baseDir,`${fontName}${Date.now()}`);
        this.distTree = {
            svg:pathJoin(this.distDir,`./fonts/${fontName}.svg`),
            ttf:pathJoin(this.distDir,`./fonts/${fontName}.ttf`),
            woff:pathJoin(this.distDir,`./fonts/${fontName}.woff`),
            html:pathJoin(this.distDir,'index.html'),
            css:pathJoin(this.distDir,'index.css'),
        }
        this.createDir();
        this.dist();
    }
    createDir(){
        if(!fs.existsSync(this.distDir)){
            fs.mkdirSync(this.distDir);
            fs.mkdirSync(pathJoin(this.distDir,'fonts'));
        }
    }
    templeteRender(){
        this.svgContent = svg2font.env.render('svg.njk',this.data);
        fs.writeFileSync(this.distTree.svg.toString(),this.svgContent);
        this.cssContent = svg2font.env.render('css.njk',this.data);
        fs.writeFileSync(this.distTree.css,this.cssContent);
        this.htmlContent = svg2font.env.render('html.njk',this.data);
        fs.writeFileSync(this.distTree.html,this.htmlContent);
    }
    ttf(){
        this.ttfBuf = Buffer.from(svg2ttf(this.svgContent,{}).buffer);
        fs.writeFileSync(this.distTree.ttf,this.ttfBuf);
    }
    woff(){
        this.woffBuf = Buffer.from(ttf2woff(this.ttfBuf,{}).buffer);
        fs.writeFileSync(this.distTree.woff,this.woffBuf);
    }
    dist(){
        this.templeteRender();
        this.ttf();
        this.woff();
    }
    getZip(){
        child_process.execSync(`zip -r ${this.data.fontName}.zip *`, {
            cwd: this.distDir
        });
        return fs.readFileSync(pathJoin(this.distDir,`${this.data.fontName}.zip`));
    }
}