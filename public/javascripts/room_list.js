$('#room').onclick = function(e) {
  e.preventDefault();
  $.get("/rooms", "json").then(function(data) {
    var html = "", template;
    template =  "<div style='font-size: 20px'>" +
      "<strong><a href='rooms/{{id}}'>{{room}}</a></strong>" +
      "</div>";

    var rooms = data.rooms;
    for(var r in rooms) {
      html += Mustache(template, rooms[r])
    }
    $(".rooms").innerHTML = html;
  }).catch(function(err) {
    console.log("Error!!")
  });
}
