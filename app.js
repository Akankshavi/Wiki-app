const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");

const app=express();
app.use(bodyParser.urlencoded({
  extended:true
}));

app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true,useUnifiedTopology: true});

const articleSchema=new mongoose.Schema({
  title:String,
  content:String
});

const Article = mongoose.model("Article",articleSchema);

//Initially Database was created and items were added using ROBO-3T, this just accesses the same database


///////////////////////////////////////////////////////REQUESTS TARGETING ALL ARTICLES/////////////////////////////////////////////////////////////

app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(err){
      res.send(err);
    }else{
      res.send(foundArticles);
    }
  });
})

.post(function(req,res){
  // console.log(req.body.title);
  // console.log(req.body.content);

  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Succesfully added a new article");
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    // the {} can be ignored when we want to delete all
    if(err){
      res.send(err);
    }else{
      res.send("Succesfully deleted all articles");
    }
  });
});


///////////////////////////////////////////////////////REQUESTS TARGETING ALL ARTICLES/////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("Article with that title not found");
    }
  });
})

.put(function(req,res){
  Article.update(
    //MongoDb doesn't allow overwriting with UpdateOne, you could use ReplaceOne instead
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("Succesfully updated article");
      }
    });
})

.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    // set tells us only the specified fields must be updated,
    // and req.body is a JSON object with the passed parameters(either one or both paramters can be passed)
    function(err){
      if(!err){
        res.send("Partially updated the selected article");
      }
    });
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("Succesfully deleted selected article");
    }else{
      res.send(err);
    }
  });
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
})
