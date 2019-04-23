
$.getJSON("/articles", function(data) {
    
    for (var i = 0; i < data.length; i++) {
      
      $("#articles").prepend("<div class='card text-center'><div class='card-header bg-dark'>" + "<p class='article-title text-light' data-id='" + data[i]._id + "'>" + data[i].title + "<br /></div>" + "<a target='_blank' href='" + data[i].link + "'>Link to Article</a>" + "</p>" + "<button class='btn-dark note' data-id='" + data[i]._id + "'>Add or Remove Notes</button> </div><br />");
    }
  });
  
  
  
  $(document).on("click", ".note", function() {
    
    $("#notes").empty();
    
    var thisId = $(this).attr("data-id");
  
    
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      
      .then(function(data) {
        console.log(data);
        
        $("#notes").append("<div class='card bg-dark text-light'><h2>" + data.title + "</h2></div><br />");
        
        $("#notes").append("<div class='container'><label for='titleinput'>Title</label><input class='form-control' type='text' id='titleinput' name='title'><br /></div>");
        
        $("#notes").append("<div class='container'><label for='bodyinput'>Note</label><textarea id='bodyinput' name='body' class='form-control'></textarea><br /></div>");
        
        $("#notes").append("<button class='btn-dark' data-id='" + data._id + "' id='savenote'>Save Note</button>");

        $("#notes").append("<button class='btn-dark' data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
  
        
        if (data.note) {
          
          $("#titleinput").val(data.note.title);
          
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  
  $(document).on("click", "#savenote", function() {
    
    var thisId = $(this).attr("data-id");
  
    
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        
        title: $("#titleinput").val(),
        
        body: $("#bodyinput").val()
      }
    })
      
      .then(function(data) {
        
        console.log(data);
        
        $("#notes").empty();
      });
  
    
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", "#deletenote", function() {
    
    var thisId = $(this).attr("data-id");
  
    
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        
        title: null,
        
        body: null
      }
    })
     
      .then(function(data) {
       
        console.log(data);
        
        $("#notes").empty();
      });
  
    
  });