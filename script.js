// JS file for the noUISlider
$(document).ready(function () {
    $('select').formSelect();
});

// Create two handler sliders for year range
var slider = document.getElementById("test-slider");
noUiSlider.create(slider, {
    start: [1950, 2025],
    tooltips: true,
    connect: true,
    step: 1,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': 1950,
        'max': 2025
    },
    format: wNumb({
        decimals: 0
    })
});

// Get the value from the handler
slider.addEventListener('click', function(event){
    // To prevent the page refresh itself
    event.preventDefault();
    var getValue = slider.noUiSlider.get();
    console.log(getValue[0]);
    console.log(getValue[1]);
});
// Until here (Please don't delete the code above this line! :)


// $("#searchButton").click(function(){
// Movie title
var movie;
// Movie's certification
var certification;
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

var apiKey = "bff2fb9d233724d8717a04b7589bf81d"

$("#searchButton").click(function () {
    var actor = $("#actorName").val();
    console.log(actor);
    var requestedGenre = $("#genre").val();
    console.log(requestedGenre)
    // Assigned later to a selected movie. Used to retrieve more info about movie to append to page
    var movieId;
    if ((actor.trim() == "") && requestedGenre === null) {
        console.log("woo")
        // TODO:
        movieId = Math.floor(Math.random() * 1000) + 1;
        console.log(movieId);

        movieSearch(movieId);
    }

    else if ((actor.trim() == "") && requestedGenre != null) {
        genreSearch(requestedGenre)
    }

    else {
        actorSearch(actor, requestedGenre);
    }

})

// function genreAndActor(actor, requestedGenre) {

// }

// Returns most popular movies of certain genre
function genreSearch(requestedGenre) {
    var genreQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&with_genres=" + requestedGenre;

    $.ajax({
        url: genreQueryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        var chooseMovie = Math.floor(Math.random() * 19) + 1;

        movieId = response.results[chooseMovie].id;

        movieSearch(movieId);

    })
}
// Searches for movie with certain actor when user inputs an actor
function actorSearch(actor, requestedGenre) {

    //Find searched actor ID
    var actorQueryURL =
        "https://api.tmdb.org/3/search/person?api_key=" + apiKey + "&query=" + actor;

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

        // Used to get id of movie
        var actorIdQueryURL;

        if (requestedGenre != null) {
            actorIdQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&with_genres=" + requestedGenre + "&with_cast=" + actorId;

            $.ajax({
                url: actorIdQueryURL,
                method: "GET",
            }).then(function (response) {
                console.log(response);


                var chooseMovie = Math.floor(Math.random() * response.results.length);

                movieId = response.results[chooseMovie].id;

                movieSearch(movieId);

            })
        }

        else {
            //Use actor ID to get all sorts of data
            //Use actor ID to get all sorts of data
            var actorIdQueryURL = "https://api.themoviedb.org/3/person/" + actorId + "?api_key=" + apiKey + "&language=en-US&append_to_response=movie_credits"; $.ajax({
                url: actorIdQueryURL,
                method: "GET",
            }).then(function (response) {

                console.log(response);
                // Returns a random movie by this actor
                var randomIdx = Math.floor(Math.random() * response.movie_credits.cast.length);
                var movieId = response.movie_credits.cast[randomIdx].id;
                movieSearch(movieId);

                // No longer needed
                // for (var i = 0; i < 3; i++) {

                //     var movieId = response.movie_credits.cast[i].id;


                // }
            });
        }


    });
};

function movieSearch(movieId) {
    // List movies actor was casted in
    var movieIdQueryURL = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey + "&language=en-US&append_to_response=videos,release_dates";

    $.ajax({
        url: movieIdQueryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        console.log(movieId);

        // Movie name
        movie = response.title;
        console.log(movie);

        // Movie certification
        certification = response.release_dates.results[1].release_dates[0].certification;
        console.log(certification);

        // Movie genre
        genres = response.genres;

        // var possibleMovies =[]
        // if (requestedGenres.trim() != "") {

        // }

        console.log(genres)
        for (var k = 0; k < genres.length; k++) {
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
        renderMovie({ genres, name: movie, year, rating, overview, poster, trailer });

        var cerificationQuryURL = "https://api.themoviedb.org/3/certification/movie/list?api_key=" + apiKey;

        $.ajax({
            url: movieIdQueryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);

        });

    });

}

function renderMovie(movie) {
    console.log("MOVIE", movie)
    $("#movies-section").empty()
    $("#movies-section").append($("<h3>").text("Title: " + movie.name))
    $("#movies-section").append($("<p>").text("Year: " + movie.year))
    $("#movies-section").append($("<img>").attr("src", movie.poster))
    $("#movies-section").append($("<p>").text("Plot: " + movie.overview))
    $("#movies-section").append($("<p>").text("Genre(s): " + movie.genres))
    $("#movies-section").append($("<p>").text("Rating: " + movie.rating))
    $("#movies-section").append(`<iframe width="420" height="315"
src="${movie.trailer}">
</iframe>`)
}