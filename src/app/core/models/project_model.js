import Mongoo from 'mongoose';

const {Schema} = Mongoo;

const projectShema = new Schema({
    id:Schema.Types.ObjectId,
    name:{
        type:String,
        require:true
    },
    desc:String,
    icons:{
        type:Schema.Types.ObjectId,
        ref:'icon'
    },
    createTime:{
        type:Date,
        default:Date.now
    },
    updateTime:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

export const project = Mongoo.model('project',projectShema);