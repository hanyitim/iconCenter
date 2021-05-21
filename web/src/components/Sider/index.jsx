import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { 
    Layout,
    Menu,
    Modal,
    Form,
    Input
} from 'antd';
import style from './index.less';
import {
    Link
} from 'react-router-dom';
import SchemaForm,{
	getValueFromObject,
	getObjectFromValue,
} from 'antd-schema-form';
import 'antd-schema-form/style/antd-schema-form.css';
import {schema, customComponent, schemaValue} from '@/js/schemaUtils';
import {
    apiLibraryList, 
	apiLibraryAdd, 
	apiLibraryUpdate,
	apiLibraryDelete,
    apiProjectAdd,
    apiProjectList,
    apiProjectUpdate,
    apiProjectDelete
} from '@/js/api.js';
import {PlusOutlined, HomeFilled} from '@ant-design/icons';
import {LIST_BY_LIBRARYID, LIST_BY_PROJECTID} from '@/js/const.js';

const {Sider} = Layout;
export default class MySider extends Component{
    static propTypes = {
        updateState:PropTypes.func
    }
    static defaultProps = {
        updateState:()=>{}
    }
    constructor(props){
        super(props);
        let hash = window.location.hash;
        this.state = {
            selectedKeys:hash,
            refreshDataTimestamp:Date.now(),
            libraryList:[],
            currentLibrary:{},
            visible:false,
            visibleOperatPlane:false,
            visibleCreatePlane:false,
            visibleDelete:false,
            operatPlaneStyle:{},
            operatData:{},
            type:'library',
            projectList:[]
        };
        this.operatList = [
            {
                label:'编辑',
                operat:'edit'
            },
            {
                label:'删除',
                operat:'delete'
            },
            {
                label:'取消',
                operat:'cancle'
            }
        ];
        this.createMenu = [
            {
                label:'添加字体库',
                operat:'library'
            },
            {
                label:'添加项目',
                operat:'project'
            },
            {
                label:'取消',
                operat:''
            }
        ];
    }
    componentDidMount(){
        this.getMenu(true);
    }
    handleMenuClick = ({key, item})=>{
        let {libraryList} = this.state;
        this.setState({
            selectedKeys:key
        });
        this.props.updateState({
            currentLibrary:libraryList[item.props.index]
        });
    }
    getMenu(){
        apiLibraryList({}).then((data)=>{
            let {selectedKeys} = this.state;
            let [currentLibrary] = data.filter((item)=>selectedKeys.replace(/.*\//g,'') === item._id);
            this.setState({
                libraryList:data,
            });
            this.props.updateState({
                currentLibrary
            });
        });
        apiProjectList({}).then((data)=>{
            this.setState({
                projectList:data
            });
            this.props.updateState({
                projectList:data
            });
        });
    }
    handleOperationSave = async ()=>{
		let formData = await this.$root.validateFields();
		let {$root} = getValueFromObject(formData);
        let {type} = this.state;
		let fn = type === 'library' ? apiLibraryAdd : apiProjectAdd;
		if($root._id){
			fn = type === 'library' ? apiLibraryUpdate : apiProjectUpdate;
		}
		try{
			this.setState({
				confirmLoading:true
			});
            fn($root).then(()=>{
                this.getMenu();
                this.setState({
                    confirmLoading:false,
                    visible:false,
                });
            });
		}catch(e){
			this.setState({
				confirmLoading:false
			});
			window.message.error(e);
		}
	}
	handleDelete = async ()=>{
        let {operatData, type} = this.state;
        let formData = await this.form.getFieldsValue();
        const fn = type === 'library' ? apiLibraryDelete : apiProjectDelete;
        if(formData.name === operatData.name){
            this.setState({visibleDelete:false});
        }else{
            window.message.error('名称错误');
        }
		fn({_id:operatData._id,name:formData.name}).then(()=>{
			this.getMenu();
		},(err)=>{
			window.message.error(err);
		});
	}
    handleShowModal = (type='library',data={}) => {
        debugger;
		this.setState({
			visible:true,
            type
		});
        console.log({type},getObjectFromValue({...schemaValue[type],...data,} ,'$root/properties'));
		setTimeout(()=>{
			this.$root && this.$root.setFieldsValue(getObjectFromValue({...schemaValue[type],...data,} ,'$root/properties'));
		},150);
	}
    contextMenu = (e)=>{
        e.preventDefault();
        let {target, currentTarget} = e,
            parent = target.parentElement,
            {index, key, type} = target.dataset,
            list = this.state[key];
        let style = {
            left:currentTarget.offsetLeft + currentTarget.offsetWidth/2,
            top:currentTarget.offsetTop,
            margin:0
        };
        if(parent !== currentTarget){
            style.left = parent.offsetLeft + parent.offsetWidth/2;
            style.top = parent.offsetTop;
        }
        this.setState({
            visibleOperatPlane:true,
            operatPlaneStyle:style,
            operatData:list[index],
            type
        });
    }
    handleOperation = ({target})=>{
        let {operat,type} = target.dataset;
        let {operatData} = this.state;
        this.setState({
            visibleOperatPlane:false
        });
        switch(operat){
            case 'edit':{
                this.handleShowModal(type,operatData);
                break;
            }
            case 'delete':
                this.setState({visibleDelete:true});
                break;
        }
    }
    handleCreate = ({target})=>{
        let {type} = target.dataset;
        this.setState({
            visibleCreatePlane:false
        });
        type && this.handleShowModal(type,{});
    }
    render(){
        let {
            selectedKeys, 
            libraryList, 
            visible, 
            confirmLoading, 
            visibleOperatPlane, 
            operatPlaneStyle,
            visibleDelete,
            operatData,
            visibleCreatePlane,
            type,
            projectList
        } = this.state;
        return (
            <Sider theme="light">
                <div className={style.sider}>
                    <header className={style.header}>
                        <span className={style.logo}><HomeFilled /></span>
                        ICONF
                    </header>
                    <div className={style.sliderModule} data-title="图标库">
                        <Menu 
                            mode="vertical" 
                            onClick={this.handleMenuClick}
                            selectedKeys={selectedKeys}
                            onContextMenu={this.contextMenu}
                        >
                            {
                                libraryList.map((library,index)=>(
                                    <Menu.Item key={`#/index/${LIST_BY_LIBRARYID}/${library._id}`}>
                                        <Link data-index={index} data-key="libraryList" data-type="library" to={`/index/${LIST_BY_LIBRARYID}/${library._id}`}>
                                            {library.name}
                                        </Link>
                                    </Menu.Item>
                                ))
                            }
                        </Menu>
                    </div>
                    <div className={style.sliderModule} data-title="项目">
                        <Menu 
                            mode="vertical" 
                            onClick={this.handleMenuClick}
                            // selectedKeys={selectedKeys}
                            onContextMenu={this.contextMenu}
                        >
                            {
                                projectList.map((project,index)=>(
                                    <Menu.Item key={`#/index/${LIST_BY_PROJECTID}/${project._id}`}>
                                        <Link data-index={index} data-key="projectList" data-type="project" to={`/index/${LIST_BY_PROJECTID}/${project._id}`}>
                                            {project.name}
                                        </Link>
                                    </Menu.Item>
                                ))
                            }
                        </Menu>
                    </div>
                    <aside className={style.aside}>
                        <a className={style.btnAddLibrary} onClick={()=>this.setState({visibleCreatePlane:true})}>
                            <PlusOutlined />
                        </a>
                        {
                            visibleCreatePlane && (
                                <ul 
                                    className={`${style.operatList} ${style.createPlane}`} 
                                    onClick={this.handleCreate}
                                >
                                    {
                                        this.createMenu.map((item)=>(
                                            <li key={item.operat} data-type={item.operat}>{item.label}</li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </aside>
                    <Modal
                        visible={visible}
                        okText="保存"
                        cancelText="取消"
                        confirmLoading={confirmLoading}
                        onOk={this.handleOperationSave}
                        onCancel={()=>this.setState({visible:false})}
                    >
                        <SchemaForm 
                            ref={(ref)=>this.$root=ref} 
                            json={schema[type]}
                            customComponent={customComponent}
                        />
                    </Modal>
                    {
                        visibleOperatPlane && (
                            <ul 
                                className={style.operatList} 
                                style={operatPlaneStyle}
                                onClick={this.handleOperation}
                            >
                                {
                                    this.operatList.map((item)=>(
                                        <li key={item.operat} data-operat={item.operat} data-type={type}>{item.label}</li>
                                    ))
                                }
                            </ul>
                        )
                    }
                    <Modal
                        title="提示"
                        visible={visibleDelete}
                        onOk={this.handleDelete}
                        onCancel={()=>this.setState({visibleDelete:false})}
                        okText="删除"
                        cancelText="取消"
                    >
                        <Form
                            ref={(ref)=>this.form=ref}
                            layout="vertical"
                        >
                            <Form.Item
                                name="name"
                                label={`请输入要删除的${type === 'library' ? '图标库' : '项目'}名称（${operatData.name}）`}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </Sider>
        );
    }
}