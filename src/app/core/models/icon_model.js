import Mongoo from 'mongoose';

const {Schema} = Mongoo;

const iconShema = new Schema({
    id:Schema.Types.ObjectId,
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
    mirrorImagePaths:{
        type:Array,
        required:true,
        default:[]
    },
    tags:{
        type:Array,
        default:[]
    },
    name:{
        type:String
    },
    code:{
        type:Number
    },
    libId:{
        type:String,
        default:''
    },
    projectIds:{
        type:Array,
        default:[]
    }
},{
    timestamps:true
});

export const icon = Mongoo.model('icon',iconShema);