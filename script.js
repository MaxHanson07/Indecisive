//Ask for actor name. Delete prompt when done testing.
var actor = prompt("Actor name");
console.log(actor);

//Find searched actor ID
var actorQueryURL =
    "http://api.tmdb.org/3/search/person?api_key=bff2fb9d233724d8717a04b7589bf81d&query=" + actor;    

$.ajax({
    url: actorQueryURL,
    method: "GET",
}).then(function (response) {

    console.log(response);

    var actorName = response.results[0].name;
    console.log(actorName);
    var actorId = response.results[0].id;
    console.log(actorId);

    //Use actor ID to get all sorts of data
    var actorIdQueryURL = "https://api.themoviedb.org/3/person/" + actorId + "/movie_credits?api_key=bff2fb9d233724d8717a04b7589bf81d&language=en-US";

    $.ajax({
        url: actorIdQueryURL,
        method: "GET",
    }).then(function (response) {

        console.log(response);
        
        for (var i = 0; i<5;i++){
            // Movies the actor was casted in
            var cast = response.cast[i];

            // Year released
            var year = cast.release_date;
            console.log(year);

            // Movie name
            var movie = cast.title;
            console.log(movie);

            // Genre ID. Not actualy ID. TODO: Gotta parse that
            var genre = cast.genre_ids[0];
            console.log(genre);

            // Movie rating out of 10
            var rating = cast.vote_average;
            console.log(rating);

            // Overview bio
            var overview = cast.overview;
            console.log(overview);

            // poster link.
            var poster = cast.poster_path;
            console.log(poster);
        }

    });
});


