let express = require("express");
let app = express();
let path2Views = __dirname + "/views/"
let bodyParser = require("body-parser")
app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")
app.use(express.static("images"));
app.use(express.static("css"));


// let mongdb = require("mongodb")
let mongoose = require("mongoose")
// const MongoClient = mongdb.MongoClient;
const url = "mongodb://localhost:27017/week7lab";
mongoose.connect(url, function (err) {
    if (err) throw err

    console.log("connect db")
})

let Task = require("./models/task")
let Developer = require("./models/developer")

app.use(bodyParser.urlencoded({ extended: false }));
// MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
//     if (err) {
//         console.log("Error", err);

//     } else {

//         console.log("Connect to db successfully");
//         db = client.db("week6labDB")
//         col1 = db.createCollection("tasks");

//         col = db.collection("tasks");
//     }
// })

app.use(bodyParser.urlencoded({
    extended: false
}))
app.get("/", function (req, res) {

    res.sendFile(path2Views + "index.html")
    // res.send("hello to my App");
});

app.get("/newTask", function (req, res) {
    res.sendFile(path2Views + "newTask.html")
});

app.post("/newTask", function (req, res) {
    // console.log(req.body);
    data = req.body
    // console.log("status: ",data.taskStatus)

    // let obj = {
    //     taskName: data.taskName,
    //     assignTo: data.assignTo, dueDate: new Date(data.taskDue), taskStatus: data.taskStatus, taskDesc: data.taskDesc
    // }
    // db.push(req.body);
    // col.insertOne(obj);
    Task.create({
        taskName: data.taskName,
        assignTo: data.assignTo,
        dueDate: new Date(data.taskDue),
        taskStatus: data.taskStatus,
        taskDes: data.taskDesc
    }, function (err) {
        if (err) console.log(err.message)
        res.redirect("/getAllTasks")
    })
    // res.sendFile(path2Views+"newcustomer.html")
})
app.get("/newDeveloper", function (req, res) {
    res.sendFile(path2Views + "newDeveloper.html")
});

app.post("/newDeveloper", function (req, res) {
    // console.log(req.body);
    data = req.body
    // console.log("status: ",data.taskStatus)

    // let obj = {
    //     taskName: data.taskName,
    //     assignTo: data.assignTo, dueDate: new Date(data.taskDue), taskStatus: data.taskStatus, taskDesc: data.taskDesc
    // }
    // db.push(req.body);
    // col.insertOne(obj);
    // req.body.firstName=undefined
    console.log(req.body);
    console.log("firstName:",req.body.firstName)
    Developer.create({
        name:{
            firstName:req.body.firstName,
            lastName:req.body.lastName
        },
        level:req.body.level,
        address:{
            state:req.body.state,
            suburb:req.body.suburb,
            street:req.body.street,
            unit:req.body.unit,
        }
    }, function (err) {
        if (err) console.log(err.message)
        res.redirect("/getAllDevelopers")
    })
    // res.sendFile(path2Views+"newcustomer.html")
})

app.get("/getAllTasks", function (req, res) {
    Task.find().populate("developer").exec(function (err, data) {
        // console.log(data)
        res.render(path2Views + "showRecord.html", { customer: data })
    })
})
app.get("/getAllDevelopers", function (req, res) {
    Developer.find().exec(function (err, data) {
        // console.log(data)
        res.render(path2Views + "showDeveloper.html", { customer: data })
    })
})

app.get("/deleteTask", function (req, res) {
    res.sendFile(path2Views + "deletePage.html")
})
app.post("/deleteById", function (req, res) {
    let query = { _id: req.body.taskId }
    // if (mongdb.ObjectID.isValid(req.body.taskId)) {
    //     query = { _id: mongdb.ObjectID(req.body.taskId) }

    // }
    Task.deleteMany(query, function (err, obj) {
        // console.log(obj.result);
    })
    res.redirect("/getAllTasks")
})
app.get("/deleteComplete", function (req, res) {
    let query = { taskStatus: "Complete" }
    Task.deleteMany(query, function (err, obj) {
        // console.log(obj.result);
    })
    res.redirect("/getAllTasks")
})
app.get("/updateStatus", function (req, res) {
    res.sendFile(path2Views + "updatePage.html")
})
app.post("/update", function (req, res) {
    // console.log("update body:",req.body)
    // console.log("taskId:",mongdb.ObjectID(req.body.taskId))

    let query = { _id: req.body.taskId }

        // query = { _id: mongdb.ObjectID(req.body.taskId) }

    Task.updateOne(query, { $set: { taskStatus: req.body.taskStatus } }, function (err, obj) {
        // console.log(obj.result);
    })
    res.redirect("/getAllTasks")
})

app.get("/:oldfirstname/:newfirstname",function(req,res){
    console.log("params:",req.params)
    console.log("params:",req.params.oldfirstname)
    console.log("params:",req.params.newfirstname)
    Developer.updateMany({"name.firstName":req.params.oldfirstname},{$set:{"name.firstName":req.params.newfirstname}}, function (err, obj) {
        console.log(obj);
    })
    res.redirect("/getAllDevelopers")
})

app.get("/findNotTomorrow", function (req, res) {
    date1 = new Date();
    console.log("date:", new Date());
    tomorrow = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate() + 1);
    console.log("tommorrow:", tomorrow);
    afterTomorrow = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate() + 2);
    console.log("afterTommorow:", afterTomorrow);
    // let query = {dueDate:{$ne:tomorrow}};
    let query = { $or: [{ dueDate: { $gt: afterTomorrow } }, { dueDate: { $lt: tomorrow } }] };
    Task.find(query).toArray(function (err, data) {
        // console.log(data)
        res.render(path2Views + "showRecord.html", { customer: data })
    })
})

app.listen(8080);
