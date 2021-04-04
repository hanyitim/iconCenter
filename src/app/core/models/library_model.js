import Mongoo from 'mongoose';
const {Schema} = Mongoo;
const libraryShema = new Schema({
    id:Schema.Types.ObjectId,
    name:{
        type:String,
        require:true
    },
    desc:String,
    owner:String,
    maxCode:{
        type:Number,
        default:50000
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
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
});

export const library = Mongoo.model('library',libraryShema);