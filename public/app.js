// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").prepend("<div class='card text-center'><div class='card-header bg-dark'>" + "<p class='article-title text-light' data-id='" + data[i]._id + "'>" + data[i].title + "<br /></div>" + "<a target='_blank' href='" + data[i].link + "'>Link to Article</a>" + "</p>" + "<button class='btn-dark note' data-id='" + data[i]._id + "'>Add or Remove Notes</button> </div><br />");
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", ".note", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<div class='card bg-dark text-light'><h2>" + data.title + "</h2></div><br />");
        // An input to enter a new title
        $("#notes").append("<div class='container'><label for='titleinput'>Title</label><input class='form-control' type='text' id='titleinput' name='title'><br /></div>");
        // A textarea to add a new note body
        $("#notes").append("<div class='container'><label for='bodyinput'>Note</label><textarea id='bodyinput' name='body' class='form-control'></textarea><br /></div>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button class='btn-dark' data-id='" + data._id + "' id='savenote'>Save Note</button>");

        $("#notes").append("<button class='btn-dark' data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", "#deletenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: null,
        // Value taken from note textarea
        body: null
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    
  });