var express = require("express");
var app = express();
var router = router = express.Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");


var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express

router.get('/get-articles', function (req, res) {
  res.sendFile(path.join(__dirname + './public/getarticles.html'));
});



app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/music-newsdb";

mongoose.connect(MONGODB_URI);


// Routes


app.get("/get-articles", function (req, res) {
  
  axios.get("https://metalinjection.net/").then(function (response) {
    
    var $ = cheerio.load(response.data);

    console.log(response.data);


    
    $(" div.content h2.title").each(function (i, element) {
      
      var result = {};

      
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      

      
      db.Article.create(result)
        .then(function (dbArticle) {
          
          console.log(dbArticle);
        })
        .catch(function (err) {
          
          console.log(err);
        });
    });

    
    res.sendFile(path.join(__dirname + '/public/getarticles.html'))


  });
});


app.get("/articles", function (req, res) {
  
  db.Article.find({})
    .then(function (dbArticle) {
     
      res.json(dbArticle);
    })
    .catch(function (err) {
      
      res.json(err);
    });
});


app.get("/articles/:id", function (req, res) {
  
  db.Article.findOne({ _id: req.params.id })
    
    .populate("note")
    .then(function (dbArticle) {
      
      res.json(dbArticle);
    })
    .catch(function (err) {
      
      res.json(err);
    });
});


app.post("/articles/:id", function (req, res) {
  
  db.Note.create(req.body)
    .then(function (dbNote) {
      
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      
      res.json(dbArticle);
    })
    .catch(function (err) {
      
      res.json(err);
    });
});

app.use('/', router);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});