import fs from 'fs';
import nunjucks from 'nunjucks';
import { join as pathJoin } from 'path';
import svg2ttf from 'svg2ttf';
import ttf2woff from 'ttf2woff';
import child_process from 'child_process';
const cwd = process.cwd();
export class svg2font {
    static env = new nunjucks.Environment(new nunjucks.FileSystemLoader(pathJoin(cwd,'src/app/js/svg2font/templates')));
    static baseDir = pathJoin(cwd,'src/assets/static/dist');
    constructor({icons, fontName, prefix}){
        this.data = {
            icons,
            fontName,
            prefix
        };
        this.init();
    }
    init(){
        this.distDir = pathJoin(svg2font.baseDir,`${this.data.fontName}${Date.now()}`);
        this.distTree = {
            svg:pathJoin(this.distDir,`./fonts/${this.data.fontName}.svg`),
            ttf:pathJoin(this.distDir,`./fonts/${this.data.fontName}.ttf`),
            woff:pathJoin(this.distDir,`./fonts/${this.data.fontName}.woff`),
            html:pathJoin(this.distDir,'index.html'),
            css:pathJoin(this.distDir,'index.css'),
        }
        this.createDir();
        this.dist();
    }
    createDir(){
        if(!fs.existsSync(svg2font.baseDir)){
            fs.mkdirSync(svg2font.baseDir);
        }
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
        child_process.execSync(`tar czvf ${this.data.fontName}.tar.gz *`, {
            cwd: this.distDir
        });
        return fs.readFileSync(pathJoin(this.distDir,`${this.data.fontName}.tar.gz`));
    }
}