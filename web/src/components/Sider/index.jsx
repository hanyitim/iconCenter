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
	apiLibraryDelete
} from '@/js/api.js';
import {PlusOutlined, HomeFilled} from '@ant-design/icons';
import {LIST_BY_LIBRARYID} from '@/js/const.js';

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
            visibleDelete:false,
            operatPlaneStyle:{},
            operatLibrary:{}
        };
        this.operatList = [
            {
                label:'编辑字体',
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
    }
    handleOperationSave = async ()=>{
		let formData = await this.$root.validateFields();
		let {$root} = getValueFromObject(formData);
		let fn = apiLibraryAdd;
		if($root._id){
			fn = apiLibraryUpdate;
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
        let {operatLibrary} = this.state;
        let formData = await this.form.getFieldsValue();
        if(formData.name === operatLibrary.name){
            this.setState({visibleDelete:false});
        }else{
            window.message.error('名称错误');
        }
		apiLibraryDelete({_id:operatLibrary._id,name:formData.name}).then(()=>{
			this.getMenu();
		},(err)=>{
			window.message.error(err);
		});
	}
    handleShowModal = (data={}) => {
		this.setState({
			visible:true,
		});
		setTimeout(()=>{
			this.$root && this.$root.setFieldsValue(getObjectFromValue({...schemaValue['library'],...data,} ,'$root/properties'));
		},150);
	}
    contextMenu = (e)=>{
        e.preventDefault();
        let {target, currentTarget} = e,
            parent = target.parentElement,
            {index} = target.dataset,
            {libraryList} = this.state;
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
            operatLibrary:libraryList[index]
        });
    }
    handleOperationLibrary = ({target})=>{
        let {operat} = target.dataset;
        let {operatLibrary} = this.state;
        this.setState({
            visibleOperatPlane:false
        });
        switch(operat){
            case 'edit':{
                this.handleShowModal(operatLibrary);
                break;
            }
            case 'delete':
                this.setState({visibleDelete:true});
                break;
        }
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
            operatLibrary
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
                                        <Link data-index={index} to={`/index/${LIST_BY_LIBRARYID}/${library._id}`}>
                                            {library.name}
                                        </Link>
                                    </Menu.Item>
                                ))
                            }
                        </Menu>
                    </div>
                    {/* <div className={style.sliderModule} data-title="项目"></div> */}
                    <aside className={style.aside}>
                        <a className={style.btnAddLibrary} onClick={this.handleShowModal}>
                            <PlusOutlined />
                        </a>
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
                            json={schema['library']}
                            customComponent={customComponent}
                        />
                    </Modal>
                    {
                        visibleOperatPlane && (
                            <ul 
                                className={style.operatList} 
                                style={operatPlaneStyle}
                                onClick={this.handleOperationLibrary}
                            >
                                {
                                    this.operatList.map((item)=>(
                                        <li key={item.operat} data-operat={item.operat}>{item.label}</li>
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
                                label={`请输入要删除的字体名称（${operatLibrary.name}）`}
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