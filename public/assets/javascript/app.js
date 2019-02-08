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

  //When a notes button is clicked
  $(".notes").on("click", function(event) {
      console.log("Notes Clicked!")
      $(".modal-body").empty();
      $(".modal-title").empty();

      var thisId = $(this).attr("data-id");
      console.log(thisId);

      $.ajax({
          method: "GET",
          url:"/articles/"+thisId  //make sure this is right
      })
      .then(function(data) {
          console.log(data);
          $(".saveNote").attr("data-id", data._id);
          $(".modal-title").html(data.title);
          if(data.note.length>0) {
            console.log("There is a note");
            for(i=0; i<data.note.length;i++){
                $(".modal-body").append("<div>"+data.note[i].body+"</div>")
            }
          }
      })
      $(".modal").modal("toggle");
  });

  $(".saveNote").on("click", function(event) {
      var thisId = $(this).attr("data-id");
      $.ajax({
          method: "POST",
          url: "/articles/"+thisId,
          data: {
            title: "test",
            body: $(".noteInput").val()
          }
      }).then(function(data) {
          $(".modal-body").append("<div>"+$(".noteInput").val()+"</div>");
          console.log(data);
          $(".noteInput").val("");
      });
  });
  
});