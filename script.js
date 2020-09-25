// // JS file for the noUISlider
$(document).ready(function () {
    // Add dropdown
    $('select').formSelect();

    // Add sidenav to become mobile responsive
    $('.sidenav').sidenav();

    // Add sticky navbar
    $(window).scroll(function () {
        if ($(window).scrollTop() > 100) {
            $("nav").addClass("stickynav");
        } else {
            $("nav").removeClass("stickynav");
        }
    })

    // Add tooltips
    $('.tooltipped').tooltip();
});

// Display carousel slider
$('.carousel.carousel-slider').carousel({
    fullWidth: true,
    indicators: true
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
var checked = false;

var requestedRatings = []
$(".rating").on('click', function (event) {
    console.log($(this).attr("data-rating"), $(this)[0].checked);

    if (checked === false) {
        checked = true;
    }
    else if (checked) {
        checked = false;
    }

    if (checked === false) {
        $(this).val($(this).attr("data-rating"));
    }
    else {
        $(this).val("");
    }

})

var minYear;
var maxYear;

// Get the value from the handler
slider.addEventListener('change', function (event) {
    // To prevent the page refresh itself
    event.preventDefault();
    var getValue = slider.noUiSlider.get();

    console.log("SLIDER", getValue)
    minYear = parseInt(getValue[0]);
    maxYear = parseInt(getValue[1]);

});
// // Until here (Please don't delete the code above this line! :)

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
    var getValue = slider.noUiSlider.get();

    // Get value from year slider
    console.log("SLIDER", getValue)
    minYear = parseInt(getValue[0]);
    maxYear = parseInt(getValue[1]);

    var actor = $("#actorName").val();
    console.log(actor);
    var requestedGenre = $("#genre").val();
    console.log(requestedGenre)
    // Assigned later to a selected movie. Used to retrieve more info about movie to append to page
    var movieId;
    // Set to true if user doesn't enter parameters other than year and doesn't click quick search button
    var quickSearch = false;


    if ((actor.trim() == "") && requestedGenre === null) {
        console.log("woo")

        yearSearch()

        // TODO:
        // Used for random button
        // movieId = Math.floor(Math.random() * 1000) + 1;
        // console.log(movieId);
        // ratingFilter();


    }

    else if ((actor.trim() == "") && requestedGenre != null) {
        genreSearch(requestedGenre)
    }

    else {
        actorSearch(actor, requestedGenre);
    }

    // if ($("#pg13Box").val() === true)
    // {
    //     console.log("woo")
    // }

})

function ratingFilter() {
    var pg13Value = $("#pg13Box").val()
    console.log(pg13Value);
    var rValue = $("#rBox").val()
    console.log(rValue)
    if ($("#pg13Box") === true) {
        console.log("fantastic")
    }
}

// Used only if user searches without entering parameters or choosing random search
function yearSearch() {
    var yearQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&primary_release_date.gte=" + `${minYear}-01-01` + "&primary_release_date.lte=" + `${maxYear}-12-31`;

    $.ajax({
        url: yearQueryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        var chooseMovie = Math.floor(Math.random() * 19) + 1;

        movieId = response.results[chooseMovie].id;

        movieSearch(movieId);

    })
}

// Returns most popular movies of certain genre
function genreSearch(requestedGenre) {
    var genreQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&with_genres=" + requestedGenre + "&primary_release_date.gte=" + `${minYear}-01-01` + "&primary_release_date.lte=" + `${maxYear}-12-31`;

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
            actorIdQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&with_genres=" + requestedGenre + "&with_cast=" + actorId + "&primary_release_date.gte=" + `${minYear}-01-01` + "&primary_release_date.lte=" + `${maxYear}-12-31`;

        }
        else {
            actorIdQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&with_cast=" + actorId + "&primary_release_date.gte=" + `${minYear}-01-01` + "&primary_release_date.lte=" + `${maxYear}-12-31`;

        }

        $.ajax({
            url: actorIdQueryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);

            var chooseMovie = Math.floor(Math.random() * response.results.length);

            // TODO: need help
            if (!chooseMovie) {
                $("#movies-section").append($("<h3>").text("No movie was found. Try searching again or adjusting your parameters to describe a movie that actually exists"))
            }
            else {

                console.log(response.results, chooseMovie)

                movieId = response.results[chooseMovie].id;

                movieSearch(movieId);
            }


        })

        // var actorIdQueryURL = "https://api.themoviedb.org/3/person/" + actorId + "?api_key=" + apiKey + "&language=en-US&append_to_response=movie_credits";
        // $.ajax({
        //     url: actorIdQueryURL,
        //     method: "GET",
        // }).then(function (response) {

        //     console.log(response);
        //     // Returns a random movie by this actor
        //     // TODO: Needs exception handling
        //     var randomIdx = Math.floor(Math.random() * response.movie_credits.cast.length);
        //     var movieId = response.movie_credits.cast[randomIdx].id;
        //     movieSearch(movieId);

        // });

    });
};

function movieSearch(movieId) {

    var movieIdQueryURL = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey + "&language=en-US&append_to_response=videos,release_dates";

    $.ajax({
        url: movieIdQueryURL,
        method: "GET",
    }).then(function (response) {
        console.log("RESPONSE", response);
        // console.log(movieId);

        // Movie name
        if (response.title === undefined) {
            movie = "Title not found. Either there is no movie that fully matches your criteria or we tried to recommend you a movie that doesn't exist. Try searching again."
        }
        else {
            movie = response.title;
            console.log(movie);
        }

        // Movie genre
        if (response.genres === undefined) {
            genres = "Cannot find genre. I guess the movie doesn't want to put itself in a box."
        }
        else {
            genres = response.genres;

            console.log(genres)
            for (var k = 0; k < genres.length; k++) {
                genres[k] = genres[k].name;
            };
            genres = genres.join(", ");
            console.log(genres)
        }


        // Year released
        if (!response.release_date) {
            year = "I cannot find the release date. Maybe its from the future? Spooky!"
        }
        else {
            year = response.release_date;
            console.log(year);
        }

        // Movie rating
        if (!response.vote_average) {
            rating = "No rating found. Are they ever right anyways?"
        }
        else {
            rating = response.vote_average;
            console.log(rating);
        }

        // Movie overview
        if (!response.overview) {
            overview = "Plot not found. Ehh, probably not worth the watch anyways. Search again or take a risk and watch it anyways!"
        }
        else {
            overview = response.overview;
            console.log(overview);
        }

        // Poster link
        // TODO: Error catching needed
        if (!response.poster_path) {
            poster = "http://uip.dk/sites/default/files/styles/movie_image_poster/public/default_images/movie-poster-placeholder_8.png?itok=DQ8mgIwY"
        }
        else {
            poster = response.poster_path;
            poster = "http://image.tmdb.org/t/p/w1280" + poster;
            console.log(poster);
        }

        // Trailer youtube embed link
        // console.log(response.videos.results[0].key)
        if (!response.videos.results[0]) {
            trailer = "https://www.youtube.com/embed/pvuFVwUZQis"
        }
        else {
            trailer = "https://www.youtube.com/embed/" + response.videos.results[0].key;
            console.log(trailer);
        }

        // console.log("RESULTS", response.release_dates.results);
        // // TODO: Need an error catch
        // if (response.release_dates.results.length === 0 || response.release_dates.length === 0 || response === undefined) {
        //     certification = "No rating found"
        // }
        // else {
        //     // Movie certification
        //     certification = response.release_dates.results[1].release_dates[0].certification || "";
        //     console.log(certification);
        // }

        renderMovie({ genres, name: movie, year, rating, overview, poster, trailer, })

    });

}

function renderMovie(movie) {
    console.log("MOVIE", movie)
    $("#movies-section").empty()
    $("#movies-section").append($("<h3>").text("Title: " + movie.name))
    $("#movies-section").append($("<img>").attr("src", movie.poster))
    $("#movies-section").append($("<p>").text("Year: " + movie.year))
    $("#movies-section").append($("<p>").text("Plot: " + movie.overview))
    $("#movies-section").append($("<p>").text("Genre(s): " + movie.genres))
    $("#movies-section").append($("<p>").text("Rating: " + movie.rating))
    $("#movies-section").append(`<iframe width="420" height="315"
src="${movie.trailer}">
</iframe>`)
    // $("#movies-section").append($("<p>").text(movie.certification))
}