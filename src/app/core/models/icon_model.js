import Mongoo from 'mongoose';

const {Schema} = Mongoo;

const iconShema = new Schema({
    id:Schema.Types.ObjectId,
    libId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        require:true
    },
    width:{
        type:Number,
        required:true
    },
    height:{
        type:Number,
        required:true
    },
    paths:{
        type:Array,
        required:true,
        default:[]
    },
    tags:{
        type:Array,
        default:[]
    },
    createTime:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

export const icon = Mongoo.model('icon',iconShema);