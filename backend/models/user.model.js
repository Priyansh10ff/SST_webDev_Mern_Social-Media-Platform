import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : Number
    },
    bio : {
        type : String,
    },
    followers : [
        //ids to be the stored
    ],
    followinga : [
        //ids to be the stored
    ],
    posts : [
        //ids to be stored
    ],
    stories : [
        //ids to be stored
    ],
    reels : [
        //ids to be stored
    ],
    profileImage : {
        type : String
    }
})

const user = mongoose.model("User", userSchema);

export default user