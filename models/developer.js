let mongoose = require("mongoose")
let developerSchema=mongoose.Schema({
    name:{
        firstName:{
            type:String,
            require:true
        },
        lastName:String
    },
    level:{
        type:String,
        validate:{
            validator:function(string){
                return string=="BEGINNER" || string=="EXPERT"
            }
        },
        default:"BEGINNER"//,
        // set:function(level){
        //     console.log("level setter:",level.toUpperCase())
        //     return level.toUpperCase();
        // }
    },
    address:{
        state:String,
        suburb:String,
        street:String,
        unit:String,
    }
})
let developerModel=mongoose.model("developer",developerSchema)
module.exports = developerModel;