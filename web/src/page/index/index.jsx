import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './index.less';
import {
	Modal,
	Form,
	Input,
	Select,
	Radio,
	Upload,
	message,
	// Badge
} from 'antd';
import { InboxOutlined, LockOutlined, UnlockOutlined, FileDoneOutlined, FileOutlined } from '@ant-design/icons';
import {
	apiIconUpdate,
	apiIconDelete,
	apiIconImport,
	apiIconList,
	apiDist,
	apiIconOperatePID
} from '@/js/api';
import {getFilePath, iconFormat, download, throttle, copyToClipboard, searchMap} from '@/js/util';
import {
	LIST_BY_ICONID,
	LIST_BY_LIBRARYID,
	OPERATE_APPEND_PID,
	OPERATE_REMOVE_PID
	// LIST_BY_PROJECTID
} from '@/js/const.js';
const components = {
	'input':Input
};
const {Dragger} = Upload;
const formatProjectList = (data)=> data.map((item)=>({value:item._id,label:item.name}));
export default class Index extends Component {
	static propTypes = {
		match:PropTypes.object,
		location:PropTypes.object,
		refreshDataTimestamp:PropTypes.number,
		projectList:PropTypes.array
	}
	static defaultProps = {
		match:{},
		location:{},
		refreshDataTimestamp:Date.now(),
		projectList:[]
	}
	constructor(props) {
		super(props);
		let {type, id} = this.props.match.params || {};
		let {search} = this.props.location || {};
		const name = (searchMap(`${search}`)).get('name');
		this.state = {
			visible:false,
			confirmLoading:false,
			data:[],
			type,
			id,
			currentIndex:-1,
			current:{},
			selectIdList:[],
			importPathList:[],
			importFileNameList:[],
			info:{},
			editSwitch:false,
			exportLoading:false,
			name
		};
		/* eslint-disable */
		this.formConfig = {
			search:[
				{
					name:'search',
					type:'input',
					noStyle:true,
				}
			],
			plane:[
				{
					name:['name'],
					label:'className',
					type:'input',
					inputProps:{
					}
				},
				{
					name:['tags'],
					label:'tags',
					type:'select',
					inputProps:{
						mode:'tags',
						tokenSeparators:[',']
					}
				},
				{
					name:['code'],
					label:'code',
					type:'input',
					inputProps:{
					}
				},
				{
					label:'content',
					name:'content',
					type:'input',
					inputProps:{
						disabled:true
					}
				},
				{
					label:'unicode',
					name:'unicode',
					type:'input',
					inputProps:{
						disabled:true
					}
				}
			],
			import:[
				{
					name:'path',
        			label:"资源",
        			valuePropName:'fileList',
					type:'dragger',
					getValueFromEvent:(e) => {
						if (Array.isArray(e)) {
						  return e;
						}
						return e && e.fileList;
					},
					inputProps:{
						name:'file',
						action:`${API}/api/common/upload`,
						multiple:true,
						maxCount:20
					}
				},
				{
					name:'type',
					label:'文件类型',
					type:'radio',
					options:[
						{value:'svg',label:'图标svg'},
						{value:'glyph',label:'字体svg'},
						{value:'json',label:'json'}
					],
					initialValue:'svg'
				}
			],
			export:[
				{
					name:'fontName',
					label:'自定义字体名称',
					type:'input',
					rules:[{
						required:true,
						message:'请输入自定义字体名称'
					}]
				},
				// {
				// 	name:'prefix',
				// 	label:'class前缀',
				// 	type:'input',
				// 	initialValue:'icon-'
				// }
			],
			append:[
				{
					name:'pId',
					label:'添加到项目',
					type:'select',
					options:formatProjectList(this.props.projectList),
					initialValue:''
				}
			]
		};
		/* eslint-enable */
	}
	componentDidMount(){
		this.getList();
	}
	UNSAFE_componentWillReceiveProps(nextProps){
		console.log(nextProps.match.params);
		let {id:nextId,type:nextType} = nextProps.match.params,
			{id,type} = this.props.match.params,
			{search} = nextProps.location;
		const searchUtil = searchMap(search);
		if(nextId !== id || nextType !== type){
			this.setState({
				id:nextId,
				type:nextType,
				selectIdList:[],
				editSwitch:false,
				name:searchUtil.get('name')
			});
			this.getList(nextId,nextType);
		}
	}
	getList(id,type){
		if(!id){
			id = this.state.id;
		}
		if(!type){
			type = this.state.type;
		}
		apiIconList({id, type}).then((data)=>{
			this.setState({
				data:iconFormat(data),
				currentIndex:-1,
				selectIdList:[]
			});
		});
	}
	handleShowModal = ()=>{
		this.setState({
			visible:true
		});
	}
	htmlIcon(){
		let {data, currentIndex,selectIdList,editSwitch} = this.state;
		return data.map(({_id:id,...icon},index)=>(
			<li 
				key={id}
				className={style.iconBox}
				data-index={index}
			>
				<div className={`${style.icon} ${index == currentIndex ||  (selectIdList.indexOf(id) > -1 && !editSwitch) ? style.selected : ''}`} data-index={index}>
					<svg transform="scale(0.5,0.5)" width={icon.width} height={icon.height} viewBox={`0 0 ${icon.width} ${icon.height}`}>
						<g>
							<path d={`${icon.paths.join('')}`}></path>
						</g>
					</svg>
				</div>
				<div className={style.iconName}>{icon.name}</div>
			</li>
		));
	}
	handleClick = ({target})=>{
		let {index} = target.dataset,
			{data,selectIdList,editSwitch} = this.state,
			current = data[index] ? {...data[index]} : null;
		if(!current) return;
		if(!editSwitch){
			let index = selectIdList.indexOf(current._id);
			if(current){
				// 添加剪切板复制类名
				copyToClipboard(current.name, () => {
					// message.success('已复制icon名称');
				});
				if(index < 0){
					selectIdList.splice(0,0,current._id);
				}else{
					selectIdList.splice(index,1);
				}
			}
			this.setState({
				selectIdList
			});
		}else{
			if(current){
				this.setState({
					currentIndex:parseInt(index),
					current
				});
				//tags 转换
				current.tags = current.tags.length > 0 ? current.tags.split(',') : [];
				this.$icon.setFieldsValue(current);
			}else{
				this.setState({currentIndex:-1,current:{}});
				this.$icon.resetFields();
			}
		}
	}
	handleUpdate = ()=>{
		let {_id, name, tags=[], code} = this.$icon.getFieldValue();
		apiIconUpdate({_id, name, tags:tags.join(','), code}).then(()=>{
			this.getList();
			this.setState({
				current:{},
				currentIndex:-1
			});
		},(msg)=>message.error(msg));
	}
	handleDelete = ()=>{
		let {currentIndex, data, editSwitch, selectIdList} = this.state,
			icon = data[currentIndex],
			ids = [];
		if(icon){
			ids.push(icon._id);
		}
		if(!editSwitch && selectIdList.length > 0){
			ids = ids.concat(selectIdList);
		}
		if(ids.length > 0){
			apiIconDelete({ids:ids.join(',')}).then(()=>{
				this.getList();
				message.success('操作成功');
			},(msg)=>message.error(msg));
		}else{
			message.error('icon不存在');
		}
	}
	handleSelectAll = (type) => {
		const {data, editSwitch} = this.state;

		if(!editSwitch) {
			if(type) {
				this.setState({
					selectIdList: data.map(v => v._id)
				});
			}else {
				this.setState({
					selectIdList: []
				});
			}
		}
	}
	formItem = ({inputProps={},type,options,...itemProps}) => {
		let Item = components[`${type}`.toLocaleLowerCase()],
			children;
		switch(type){
			case 'input':
				children = <Item {...inputProps} />;
				break;
			case 'select':
				children = (
					<Select
						{...inputProps}
					>
						{
							Array.isArray(options) && options.map((option)=>(
								<Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
							))
						}
					</Select>
				);
				break;
			case 'radio':
				children = (
					<Radio.Group
						{...inputProps}
					>
						{
							Array.isArray(options) && options.map((option)=>(
								<Radio key={option.value} value={option.value}>{option.label}</Radio>
							))
						}
					</Radio.Group>
				);
				break;
			case 'dragger':
				children = (
					<Dragger {...inputProps}>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">点击或者拖动到此区域上传</p>
					</Dragger>
				);
				break;
		}
		return (
			<Form.Item
				{...itemProps}
			>
				{children}
			</Form.Item>
		);
		
	}
	form = (config)=>config.map((item)=>this.formItem(item))
	handleOperationSave = async ()=>{
		let formData = await this.$import.validateFields(),
			{id} = this.state;
		formData.path = getFilePath(formData.path);
		apiIconImport({...formData,libId:id}).then(()=>{
			this.getList();
			this.setState({
				importPathList:[],
			});
			this.$import.setFieldsValue({path:[]});
			message.success('导入成功');
		},(msg)=>message.error(msg));
	}
	handleEditSwitch = ({target})=>{
		let {index} = target.dataset,
			checked = index === '2';
		
		const initState = checked ? {
			selectIdList:[]
		}:{
			current:{},
			currentIndex:-1
		};
		this.setState({
			editSwitch:checked,
			...initState
		});
	}
	handleExport = throttle(async()=>{
		let {id, type, selectIdList:icons, name} = this.state;
		let formData = await this.$iconExport.validateFields();
		let fontName = formData.fontName || name;
		this.setState({exportLoading:true});
		if(icons.length > 0 ){
			type = LIST_BY_ICONID;
		}
		apiDist({id,type,icons:icons.join(','),fontName,prefix:formData.prefix}).then((data)=>{
			const blob = new Blob([data],{type:'application/tar+gzip'});
			const url = window.URL.createObjectURL(blob);
			download(url,`${fontName}_${Date.now()}.tar.gz`);
			this.setState({exportLoading:false});
		},(msg)=>{
			message.error(msg);
			this.setState({exportLoading:false});
		});
	},1000)
	handleOperatePID = throttle(async({target})=>{
		const {operate} = target.dataset;
		const {selectIdList:icons, id, type} = this.state;
		this.setState({operatePIDLoading:true});
		let pId;
		if(icons.length === 0){
			message.error('暂无选择icon');
			return;
		}
		if(type == LIST_BY_LIBRARYID){
			const formData = await this.$iconAppend.getFieldValue();
			pId = formData.pId;
		}else{
			pId = id;
		}
		apiIconOperatePID({ids:icons.join(','),pId,operate}).then(()=>{
			message.success('操作成功');
			if(operate == OPERATE_REMOVE_PID){
				this.getList();
			}
			this.setState({operatePIDLoading:false});
		},(msg)=>{
			message.error(msg);
			this.setState({operatePIDLoading:false});
		});
	},1000);
	render() {
		let {visible, currentIndex, editSwitch, data, exportLoading, type, operatePIDLoading, name} = this.state;
		return (
            <div className={style.page}>
				<header className={style.header}>
					{
						type == LIST_BY_LIBRARYID && (
							<div className={style.libraryInfo}>
								<div className={style.name}>{name || ''}</div>
								<div className={style.count}>{data.length}</div>
							</div>
						)
					}
					<div className={style.switchBox}>
						<div className={style.switch} data-edit={editSwitch} onClick={this.handleEditSwitch}>
							<span className={`${style.switchBtn}`} data-index="1"><LockOutlined /></span>
							<span className={`${style.switchBtn}`} data-index="2"><UnlockOutlined /></span>
							<span className={style.line}></span>
						</div>
					</div>
					<div className={style.checkBox}>
						<FileDoneOutlined className={`${style.checkIcon} ${editSwitch ? style.disabled : null}`} onClick={this.handleSelectAll.bind(this, true)} />
						<FileOutlined className={`${style.checkIcon} ${editSwitch ? style.disabled : null}`} onClick={this.handleSelectAll.bind(this, false)} />
					</div>
					{
						type == LIST_BY_LIBRARYID && (
							<div className={style.operationBox}>
								<a className={`btn ${style.btnImport}`} onClick={this.handleShowModal} >导入</a>
							</div>
						)
					}
				</header>
				<div className={style.content}>
					<ul 
						className={style.list}
						onClick={this.handleClick}
					>
						{this.htmlIcon()}
					</ul>
					<div className={style.panel}>
						{
							editSwitch ? (
								<div className={style.edit}>
									{
										type == LIST_BY_LIBRARYID ? (
											<>
												<Form
													layout="vertical"
													className={style.from}
													ref={(ref)=>this.$icon=ref}
												>
													{this.form(this.formConfig.plane)}
												</Form>
												<div className={style.operation}>
													{
														currentIndex >= 0 ? (
															<>
																<a className={`btn ${style.mb}`} data-type="primary" onClick={this.handleUpdate}>修改</a>
																<a className={`btn ${style.mb}`} data-type="danger" onClick={this.handleDelete}>删除</a>
															</>
														):null
													}
												</div>
											</>
										):(
											<>
												<Form
													layout="vertical"
													className={style.from}
													ref={(ref)=>this.$icon=ref}
												>
													{this.form(this.formConfig.plane)}
												</Form>
												<div className={style.operation}>
													{
														currentIndex >= 0 ? (
															<>
																<a className={`btn ${style.mb}`} data-type="primary" onClick={this.handleUpdate}>修改</a>
																<a className={`btn ${style.mb}`} data-type="danger" onClick={this.handleDelete}>删除</a>
															</>
														):null
													}
												</div>
											</>
										)
									}
									
									{/* {
										currentIcon.paths && (
											<div className={style.editPath}>
												<div className={style.svgBox}>
													<svg width={currentIcon.width} height={currentIcon.height} viewBox={`0 0 ${currentIcon.width} ${currentIcon.height}`}>
														<g>
															<path d={`${currentIcon.paths.join('')}`}></path>
														</g>
													</svg>
												</div>
												<div className={style.operation}>
													<Button type="primary" onClick={this.handleTranform}>变形</Button>
												</div>
											</div>
										)
									} */}
								</div>
							):(
								<div className={style.export}>
									<Form
										layout="vertical"
										className={style.from}
										ref={(ref)=>this.$iconExport=ref}
									>
										{type === '1' && this.form(this.formConfig.export)}
									</Form>
									<div className={style.operation}>
										<a data-type="primary" className={`btn ${style.mb}`} onClick={this.handleExport} data-loading={exportLoading}>
											导出
										</a>
										<a
											data-type="danger"
											className={`btn ${style.mb}`}
											onClick={ type == LIST_BY_LIBRARYID ? this.handleDelete : this.handleOperatePID}
											data-loading={exportLoading}
											data-operate={OPERATE_REMOVE_PID}
										>
											批量删除
										</a>
									</div>
									{
										type == LIST_BY_LIBRARYID && (
											<>
												<Form
													layout="vertical"
													className={style.from}
													ref={(ref)=>this.$iconAppend=ref}
												>
													{this.form(this.formConfig.append)}
												</Form>
												<div className={style.operation}>
													<a
														data-type="primary" 
														className={`btn ${style.mb}`}
														onClick={this.handleOperatePID}
														data-loading={operatePIDLoading}
														data-operate={OPERATE_APPEND_PID}
													>
														添加
													</a>
												</div>
											</>
										)
									}
								</div>
							)
						}
					</div>
				</div>
				<Modal
					visible={visible}
					title="导入图标"
					closable
					onCancel={()=>this.setState({visible:false})}
					okText='添加'
					cancelText='取消'
					onOk={this.handleOperationSave}
				>
					<Form
						layout="vertical"
						ref={(ref)=>this.$import=ref}
					>
						{this.form(this.formConfig.import)}
					</Form>
				</Modal>
            </div>
		);
	}
}