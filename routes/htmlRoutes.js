var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.Article.find({saved:false})
        .then(function(dbArticle) {
            res.render("index", {
                msg: "Welcome!",
                articles:dbArticle
            });
        });
    });

    app.get("/saved", function(req, res) {
        db.Article.find({saved:true})
        .populate("Note")
            .then(function(dbSave) {
                res.render("saved", {
                    msg:"Welcome!",
                    articles:dbSave
                });
            });
    });
};