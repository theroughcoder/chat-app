
// schema
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type : String,
        required : true,
    }, 
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true,
    },
    isAdmin:{
        type : Boolean,
        default: false,
        required : true,
    },
    friends:[ 
        {
           friend_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
           chat_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true},
           name: {type: String, required: true},
        } ,{
            timestamps: true
        } 
    ],
},{
    timestamps: true
})
//creating model or collection
const User = mongoose.model("User", userSchema);

export default User; 