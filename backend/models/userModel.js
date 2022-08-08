
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
    img:{
        type: String
    }
    
},{
    timestamps: true
})
//creating model or collection
const User = mongoose.model("User", userSchema);

export default User; 