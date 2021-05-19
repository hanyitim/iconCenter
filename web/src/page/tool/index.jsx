import React, { Component } from 'react';
import style from './index.less';
import PropTypes from 'prop-types';
import svgpath from 'svgpath';
import {download} from '@/js/util.js';

export default class Tool extends Component {
	static propTypes = {
		location:PropTypes.object,
		updateHash:PropTypes.string
	}
	static defaultProps = {
		location:{}
	}
	constructor(props) {
		super(props);
	}
	handleChange = ({target})=>{
		let file = target.files[0];
		if(file){
			let render = new FileReader();
			render.onloadend = ()=>{
				let result = render.result;
				let resultText = result.replace(/d="(.+)"/g,(all,path)=>{
					// return `d="${svgpath(path).matrix([1,0,0,-1,0,0]).matrix([1,0,0,1,0,1024]).toString()}"`;
					return `d="${svgpath(path).matrix([1,0,0,-1,0,0]).matrix([1,0,0,1,0,1024]).toString()}"`;
				});
				download(`data:text/plain;charset=utf-8,${encodeURIComponent(resultText)}`,file.name.replace(/(\.\w+)$/g,'.mirror.image$1'));
			};
			render.readAsText(file);
		}
	}
	render() {
		return (
            <div className={style.page}>
				<p>上传字体文件，生成svg镜像文件</p>
                <input type="file" onChange={this.handleChange} />
            </div>
		);
	}
}