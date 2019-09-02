let express=require("express");
let app=express();
let path2Views=__dirname+"/views/"
let bodyParser=require("body-parser")
app.engine("html",require("ejs").renderFile)
app.set("view engine","html")
app.use(express.static("images"));
app.use(express.static("css"));

let mongdb=require("mongodb")
const MongoClient=mongdb.MongoClient;
const url="mongodb://192.168.0.78:27017";
let db=null;
let col=null;

app.use(bodyParser.urlencoded({extended:false}));
MongoClient.connect(url,{useNewUrlParser:true},(err,client)=>{
    if(err){
        console.log("Error",err);

    }else{
        console.log("Connect to db successfully");
        db=client.db("week6labDB")
        col1=db.createCollection("tasks");
        
        col=db.collection("tasks");
    }
})

app.use(bodyParser.urlencoded({
    extended:false
}))
app.get("/",function(req,res){
    res.sendFile(path2Views+"index.html")
    // res.send("hello to my App");
});

app.get("/newTask",function(req,res){
    res.sendFile(path2Views+"newcustomer.html")
});

app.post("/newTask",function(req,res){
    // console.log(req.body);
    data=req.body
    // console.log("status: ",data.taskStatus)

    let obj={taskName:data.taskName,assignTo:data.assignTo,dueDate:new Date(data.taskDue),taskStatus:data.taskStatus,taskDesc:data.taskDesc}
    // db.push(req.body);
    col.insertOne(obj);
    res.redirect("/getAllTasks")
    // res.sendFile(path2Views+"newcustomer.html")
})

app.get("/getAllTasks",function(req,res){
    col.find({}).toArray(function(err,data){
        // console.log(data)
        res.render(path2Views+"showRecord.html",{customer:data})
    })
})

app.get("/deleteTask",function(req,res){
    res.sendFile(path2Views+"deletePage.html")
})
app.post("/deleteById",function(req,res){
    let query={_id:req.body.taskId}
    if(mongdb.ObjectID.isValid(req.body.taskId)){
        query={_id:mongdb.ObjectID(req.body.taskId)}

    }
    col.deleteMany(query,function(err,obj){
        // console.log(obj.result);
    })
    res.redirect("/getAllTasks")
})
app.get("/deleteComplete",function(req,res){
    let query={taskStatus:"Complete"}
    col.deleteMany(query,function(err,obj){
        // console.log(obj.result);
    })
    res.redirect("/getAllTasks")
})
app.get("/updateStatus",function(req,res){
    res.sendFile(path2Views+"updatePage.html")
})
app.post("/update",function(req,res){
    // console.log("update body:",req.body)
    // console.log("taskId:",mongdb.ObjectID(req.body.taskId))
    
    let query={_id:req.body.taskId}
    if(mongdb.ObjectID.isValid(req.body.taskId)){
        query={_id:mongdb.ObjectID(req.body.taskId)}

    }
    col.updateOne(query,{$set:{taskStatus:req.body.taskStatus}},function(err,obj){
        // console.log(obj.result);
    })
    res.redirect("/getAllTasks")
})

app.listen(8080);
