import React,{Component} from 'react';
import PropTypes from 'prop-types';
import style from './index.less';
import {placeholderData} from '@/js/util';
import {Link} from 'react-router-dom';
import {Modal, Input, Form} from 'antd';
import { EditFilled, DeleteFilled} from '@ant-design/icons';

export default class CardList extends Component{
    static propTypes = {
        data:PropTypes.array,
        showModal:PropTypes.func,
        handleDelete:PropTypes.func,
        path:PropTypes.string
    }
    static defaultProps = {
        data:[],
        showModal:function(){},
        handleDelete:function(){},
        path:''
    }
    constructor(props){
        super(props);
        this.state = {
            visible:false,
            currentOperationData:{}
        };
        this.handleLink = this.handleLink.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleShowDeleteConfirmModal = this.handleShowDeleteConfirmModal.bind(this);
    }
    items(){
        let {data} = this.props,
            items;
        items = placeholderData(data,5,['button']).map((card,index)=>{
            switch(card){
                case 'button':
                    return (
                        <li key={0} className={style.card} onClick={this.handleAdd}>
                            <div className={style.btnAdd}>添加</div>
                        </li>
                    );
                case 'placeholder':
                    return (
                        <li className={`${style.card} ${style.hidden}`}></li>
                    );
                default:
                    return (
                        <li key={card._id} className={style.card} onClick={this.handleLink}>
                            <div className={style.img}></div>
                            <div className={style.info}>
                                <div className={style.title}>{card.name}</div>
                                {/* <div className={style.desc}>{card.desc}</div> */}
                                <aside className={style.owner}>{`创建：${card.owner}`}</aside>
                            </div>
                            <Link className={style.link} to={`/details/${this.props.path}/${card._id}`} />
                            <a className={`${style.btnEdit} ${style.btnOperation}`}  data-index={index} onClick={this.handleEdit}><EditFilled /></a>
                            <a className={`${style.btnDelete} ${style.btnOperation}`}  data-index={index} onClick={this.handleShowDeleteConfirmModal}><DeleteFilled /></a>
                        </li>
                    );
            }
        });
        return items;
    }
    handleAdd(){
        this.props.showModal({});
    }
    handleLink(){
        
    }
    handleEdit({target}){
        let {index} = target.dataset;
        let {data} = this.props;
        if(data[index]){
            this.props.showModal(data[index]);
        }
    }
    async handleDelete(){
        let {currentOperationData} = this.state;
        let formData = await this.form.getFieldsValue();
        if(formData.name === currentOperationData.name){
            this.setState({visible:false});
            this.props.handleDelete({_id:currentOperationData._id,name:formData.name});
        }else{
            window.message.error('名称错误');
        }
    }
    handleShowDeleteConfirmModal({target}){
        let {index} = target.dataset;
        let {data} = this.props;
        this.setState({visible:true,currentOperationData:{...data[index]}});
    }
    render(){
        let {visible,currentOperationData} = this.state;
        return (
            <>
                <ul className={style.list}>
                    {this.items()}
                </ul>
                <Modal
                    title="提示"
                    visible={visible}
                    onOk={this.handleDelete}
                    onCancel={()=>this.setState({visible:false})}
                    okText="删除"
                    cancelText="取消"
                >
                    <Form
                        ref={(ref)=>this.form=ref}
                        layout="vertical"
                    >
                        <Form.Item
                            name="name"
                            label={`请输入要删除的字体名称（${currentOperationData.name}）`}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}