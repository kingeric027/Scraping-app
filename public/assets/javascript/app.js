//Adding saved article to API
$(function() {  
    $("#scrape").on("click", function() {
        console.log("Scrape");
        $.ajax({
            method: "GET",
            url:"/scrape"
        })
        
    })
    $(".saveArticle").on("click", function(event) {
      event.preventDefault();
      console.log("CLICKED");
      if($(this).html() == "Save Article"){
        $(this).html("Saved");
      } else {
        $(this).html("Removed");
      }
      
      
      var id = $(this).attr("data-id");

      //Update the article so saved is true
      $.ajax({
          method: "POST",
          url: "/articles/saved/"+id
      }).then(function(data) {
          console.log(data);
      })
  });

  $("#notes").on("click", function(event) {
      console.log("CLICKED");
      var id = $(this).attr("data-id");
      var modalid = "#"+id;
      console.log(modalid);
      $(modalid).modal("toggle");
  });

  $("#submitNote").on("click", function(event) {
      var id = $(this).attr("data-id");
      $.ajax({
          method: "POST",
          url: "/articles/"+id,
          data: {
            title: "test",
            body: $("#noteInput").val()
          }
      }).then(function(data) {
          console.log(data);
      })
  })
  
});