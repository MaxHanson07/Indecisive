// JS file
$(document).ready(function() {
    $('select').formSelect();
});

var slider = document.getElementById("test-slider");
noUiSlider.create(slider, {
    start: [20, 80],
    connect: true,
    step: 1,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': 0,
        'max': 100
    },
    format: wNumb({
       decimals: 0
    })
});

// $("#searchButton").click(function(){
// Movie title
var movie;
// Movie's genre(s)
var genre
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
    if (actor.trim() == "") {
        console.log("woo")
        // Movie search with random id
        // movieSearch(movieId)
    }
    else {
        actorSearch(actor);
        
    }

    var requestedGenre = $("#genre").val();
    console.log(requestedGenre)

})

// function filterGenre(requestedGenre) {
    
// }



 
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

            for (var i = 0; i < 3; i++) {

                var movieId = response.cast[i].id;
                // Find 
                var movieIdQueryURL = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=bff2fb9d233724d8717a04b7589bf81d&language=en-US";

                $.ajax({
                    url: movieIdQueryURL,
                    method: "GET",
                }).then(function (response) {
                    console.log(response);
                    trailer = "https://www.youtube.com/embed/" + response.results[0].key;
                    console.log(trailer);
                });
                // Movies the actor was casted in
                var cast = response.cast[i];
                console.log(cast);

                // Year released
                year = cast.release_date;
                console.log(year);

                // Movie name
                movie = cast.title;
                console.log(movie);

                // Genre ID
                genre = cast.genre_ids;
                // var genres = []
                // var genreId = cast.genre_ids;

                for (var j = 0; j < genre.length; j++) {
                    //  genres.push(genreId[j])

                    if (genre[j] === 28) {
                        genre[j] = "Action";
                    } else if (genre[j] === 12) {
                        genre[j] = "Adventure";
                    } else if (genre[j] === 16) {
                        genre[j] = "Animation";
                    } else if (genre[j] === 35) {
                        genre[j] = "Comedy";
                    } else if (genre[j] === 80) {
                        genre[j] = "Crime";
                    } else if (genre[j] === 99) {
                        genre[j] = "Documentary";
                    } else if (genre[j] === 18) {
                        genre[j] = "Drama";
                    } else if (genre[j] === 10751) {
                        genre[j] = "Family";
                    } else if (genre[j] === 14) {
                        genre[j] = "Fantasy";
                    } else if (genre[j] === 36) {
                        genre[j] = "History";
                    } else if (genre[j] === 27) {
                        genre[j] = "Horror";
                    } else if (genre[j] === 10402) {
                        genre[j] = "Music";
                    } else if (genre[j] === 9648) {
                        genre[j] = "Mystery";
                    } else if (genre[j] === 10749) {
                        genre[j] = "Romance";
                    } else if (genre[j] === 878) {
                        genre[j] = "Science Fiction";
                    } else if (genre[j] === 53) {
                        genre[j] = "Thriller";
                    } else if (genre[j] === 10752) {
                        genre[j] = "War";
                    } else if (genre[j] === 37) {
                        genre[j] = "Western";
                    }
                }
                genre = genre.join(", ");
                console.log(genre)

                // Movie rating out of 10
                rating = cast.vote_average;
                console.log(rating);

                // Overview bio
                overview = cast.overview;
                console.log(overview);

                // Poster link
                poster = cast.poster_path;
                poster = "http://image.tmdb.org/t/p/w1280" + poster;
                console.log(poster);
            }
        });
    });
};
// };
