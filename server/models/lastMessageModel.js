import mongoose  from "mongoose";

const lastMessageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    lastMessage:{
        type:String,
        required:true,
        default:'start conversation'

    },


},{timestamps:true});


const lastMessage=mongoose.model("lastMessage",lastMessageSchema);

export default lastMessage;