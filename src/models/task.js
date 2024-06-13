const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
    name: String,
    description:String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
});

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;