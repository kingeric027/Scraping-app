
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    // A GET route for scraping The Atlantic Website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.theatlantic.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article").each(function(i, element) {
        // Save an empty result object
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object
        if( $(element).find("h2").text() === ''){
          result.title = $(element).find("h1").text();
        } else {
          result.title = $(element).find("h2").text();
        }
        result.summary = $(element).find("p").text();
        result.link = $(element).find("a").attr("href");
        result.image = $(element).find("img").attr("data-srcset");
        result.saved = false;

        //Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

  // Route for getting all Articles from the db THAT HAVE NOT BEEN SAVED
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({saved:false})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

// Route for getting all articles from the db that HAVE BEEN SAVED
app.get("/saved/articles", function(req, res) {
    db.Article.find({saved:true})
        .populate("Note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

  // Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push:{ note: dbNote._id }});
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.delete("/clear", function(req, res) {
    db.Article.remove({})
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });

  //Route for saving an article (Changing saved to true)
  //app.post("/articles/saved/:id", function(req, res) {
  //    db.Article.findOneAndUpdate({_id: req.params.id }, {saved:true})
  //    .then(function(dbArticle) {
  //      res.json(dbArticle);
  //  })
  //  .catch(function(err) {
  //      res.json(err)
  //  })
  //})


app.post("/articles/saved/:id", function(req, res) {
    // First find the article
    db.Article.findOne({_id:req.params.id})
    .then(function(dbArticle) {
        db.Article.findOneAndUpdate({_id:req.params.id}, {saved:!dbArticle.saved})
        .then(function(changedSaved) {
            res.json(changedSaved);
        })
    })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  
  

};

  