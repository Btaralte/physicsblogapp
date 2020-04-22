var bodyParser = require("body-parser");
    mongoose   = require("mongoose");
    express    = require("express");
    methodOverride = require("method-override")
    app        = express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"))

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);    

mongoose.connect("mongodb://localhost:27017/blogapp");
var Blogschema = mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{
        type:Date,
        default:Date.now,
    },
});
var Blog = mongoose.model("Blog",Blogschema);

app.get("/",(req,res)=>{
    res.redirect("/blogs");
})

app.get("/blogs",(req,res)=>{
    Blog.find({},(err,body)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:body});
        }
    })
});

app.get("/blogs/new",(req,res)=>{
    res.render("form");
});
app.post("/blogs",(req,res)=>{
    Blog.create(req.body.blog,(err,body)=>{
        if(err){
            res.render("form");
        }
        else{
            res.redirect("/blogs");
        }
    })
});
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,body)=>{
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:body});
        }
    })
});
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,body)=>{
        if(err){
            res.redirect("/blogs/"+req.params.id);
        }
        else{
            res.render("edit",{blog:body});
        }
    });
});
app.put("/blogs/:id",(req,res)=>{
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,blog)=>{
        if(err){
            res.redirect("/blogs/"+req.params.id+"/edit");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});
app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndDelete(req.params.id,(err)=>{
        res.redirect("/blogs");
    })
});

app.listen(3000,()=>{
    console.log("Server has started");
});