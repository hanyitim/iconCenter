import React from 'react';
import {
    DatePicker, 
    Input,
    Radio
} from 'antd';
const {RangePicker} = DatePicker;
const library = {
    id:'$root',
    type: 'object',
    title: '编辑字体',
    properties: {
        _id:{
            id:'$root/properties/_id',
            type:'string',
            title:'id',
        },
        name:{
            id:'$root/properties/name',
            type:'string',
            title:'名称',
            description:'请填写资源名称',
            $required:true
        },
        desc:{
            id:'$root/properties/desc',
            type:'string',
            title:'简介',
            $required:true
        },
        owner:{
            id:'$root/properties/owner',
            type:'string',
            title:'创建人',
            $required:true
        },
    }
};

export const customComponent = {
    rangePicker(item, form, required){
        return <RangePicker required={ required } showTime />;
    },
    textArea(item, form, required){
        return <Input.TextArea  required={ required } row={4} />;
    },
    radio(item, form, required){
        return (
            <Radio.Group required={required}>
                {
                    item.$options.map((children)=>(
                        <Radio key={children.value} value={children.value}>{children.label}</Radio>
                    ))
                }
            </Radio.Group>
        );
    }
};


export const schema = {
    library,
};

export const schemaValue = {
    library:{
        id:'',
        name:'',
        desc:'',
        onwer:''
    }
};