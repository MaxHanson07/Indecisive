// JS file for the noUISlider
$(document).ready(function() {
    $('select').formSelect();
});

var slider = document.getElementById("test-slider");
noUiSlider.create(slider, {
    start: [1900, 2025],
    tooltips: true,
    connect: true,
    step: 1,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': 1900,
        'max': 2025
    },
    format: wNumb({
       decimals: 0
    })
});
// Until here (Please don't delete the code above this line! :)


// $("#searchButton").click(function(){
// Movie title
var movie;
// Movie's genre(s)
var genre;
// Movie's release year
var year;
// Movie's rating (how good it is, not MPAA)
var rating;
// Movie overview summary
var overview;
// Poster image of movie
var poster;
// Movie's trailer
var trailer;

$("#searchButton").click(function () {
    var actor = $("#actorName").val();
    console.log(actor);
    actorSearch(actor);
 })
 
// Searches for movie with certain actor when user inputs an actor
function actorSearch(actor) {

    //Find searched actor ID
    var actorQueryURL =
        "https://api.tmdb.org/3/search/person?api_key=bff2fb9d233724d8717a04b7589bf81d&query=" + actor;

    $.ajax({
        url: actorQueryURL,
        method: "GET",
    }).then(function (response) {

        console.log(response);

        // Gets the actors name and their TMDb id
        var actorId = response.results[0].id;
        console.log(actorId);

        var actorName = response.results[0].name;
        console.log(actorName);

        //Use actor ID to get all sorts of data
        var actorIdQueryURL = "https://api.themoviedb.org/3/person/" + actorId + "?api_key=bff2fb9d233724d8717a04b7589bf81d&language=en-US&append_to_response=movie_credits";

        $.ajax({
            url: actorIdQueryURL,
            method: "GET",
        }).then(function (response) {

            console.log(response);
            for (var i = 0; i < 3; i++) {

                var movieId = response.movie_credits.cast[i].id;
                // List movies actor was casted in
                var movieIdQueryURL = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=bff2fb9d233724d8717a04b7589bf81d&language=en-US&append_to_response=videos";

                $.ajax({
                    url: movieIdQueryURL,
                    method: "GET",
                }).then(function (response) {
                    console.log(response);
                    console.log(movieId);

                    // Movie name
                    movie = response.title;
                    console.log(movie);

                    // Movie genre
                    genres = response.genres;
                    console.log(genres)
                    for(var k =0;k<genres.length;k++){
                        genres[k] = genres[k].name;
                    };
                    genres = genres.join(", ");
                    console.log(genres)

                    // Year released
                    year = response.release_date;
                    console.log(year);

                    // Movie rating
                    rating = response.vote_average;
                    console.log(rating);

                    // Movie overview
                    overview = response.overview;
                    console.log(overview);

                    // Poster link
                    poster = response.poster_path;
                    poster = "http://image.tmdb.org/t/p/w1280" + poster;
                    console.log(poster);

                    // Trailer youtube embed link
                    trailer = "https://www.youtube.com/embed/" + response.videos.results[0].key;
                    console.log(trailer);

                });
                
            }
        });
    });
};

