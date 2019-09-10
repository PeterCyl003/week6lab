let mongoose = require("mongoose")
let taskSchema = mongoose.Schema({
    taskName: String,
    assignTo: {
        type: mongoose.Types.ObjectId,
        ref:"developer"
    },
    dueDate:Date,
    taskStatus:{
        type:String,
        validate:{
            validator:function(string){
                return string=="InProgress" || string=="Complete"
            }
        },
        default:'InProgress'
    },
    taskDes:String

})
let itemModel=mongoose.model("task",taskSchema)
module.exports=itemModel