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

var requestedRatings = ["PG-13","G","PG","R","NC-17"]
$(".rating").on('click', function (event) {
    // console.log($(this).attr("data-rating"), $(this)[0].checked);

    if (requestedRatings.includes($(this).attr("data-rating"))) {
        var indexRating = requestedRatings.indexOf($(this).attr("data-rating"));

        requestedRatings.splice(indexRating, 1);
        console.log(requestedRatings);
    }
    else {
        requestedRatings.push($(this).attr("data-rating"));
        console.log(requestedRatings);
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

// Add clear button to clear the entire form
var clearButton  = $("#clearButton");
clearButton.on("click", function(){
    $(".rating").prop("checked", true);
    $("#actorName").val("");
    $("#genre").prop("selectedIndex", 0);
    $("#genre").formSelect();
    slider.noUiSlider.reset();
})

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

var ratingQuery;

// Run function to pull search results from local storage and fill array with it
let userSearch = JSON.parse(localStorage.getItem("movieResults")) || [];
console.log(userSearch)

for (let i = userSearch.length - 1; i > userSearch.length - 6; i--){
    $(".searchHistory").append($("<li>").text(userSearch[i]))
}

// Are you feeling lucky?
$("#randomButton").click(function () {
    // Used for random button
    movieId = Math.floor(Math.random() * 1000) + 1;
    movieSearch(movieId);
})

$("#searchButton").click(function () {
    console.log(userSearch)
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

    if ((actor.trim() == "") && requestedGenre === null) {
        console.log("woo")

        ratingFilter();
        yearSearch()

    }

    else if ((actor.trim() == "") && requestedGenre != null) {
        ratingFilter();
        genreSearch(requestedGenre)
    }

    else {
        ratingFilter();
        actorSearch(actor, requestedGenre);
    }

})

// Determines which ratings are checked and and converts them into a usable link addition for api calls
function ratingFilter() {
    ratingsQuery = requestedRatings[0];
    if (requestedRatings.length > 1) {
        for (let i = 1; i < requestedRatings.length; i++) {
            ratingsQuery = ratingsQuery + "%7C" + requestedRatings[i]
        }
    }

}

// Used only if user searches without entering parameters or choosing random search
function yearSearch() {
    if (requestedRatings.length < 1) {
        $("#movies-section").append($("<h5>").text("Must allow for at least one rating"));
    }
    else {
        var yearQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&primary_release_date.gte=" + `${minYear}-01-01` + "&primary_release_date.lte=" + `${maxYear}-12-31` + "&certification_country=US&certification=" + ratingsQuery;

        console.log("YEAR-URL" + yearQueryURL)
        $.ajax({
            url: yearQueryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);

            var chooseMovie = Math.floor(Math.random() * 19) + 1;

            if (!chooseMovie) {
                $("#movies-section").append($("<h5>").text("No movie was found. Try searching again or adjusting your parameters to describe a movie that actually exists"))
            }
            else {
                movieId = response.results[chooseMovie].id;
                movieSearch(movieId);
            }

        })
    }
}

// Returns most popular movies of certain genre
function genreSearch(requestedGenre) {
    if (requestedRatings.length < 1) {
        $("#movies-section").append($("<h5>").text("Must allow for at least one rating"));
    }
    else {
        var genreQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&with_genres=" + requestedGenre + "&primary_release_date.gte=" + `${minYear}-01-01` + "&primary_release_date.lte=" + `${maxYear}-12-31` + "&certification_country=US&certification=" + ratingsQuery;
        console.log("Genre URL" + genreQueryURL)

        $.ajax({
            url: genreQueryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);

            var chooseMovie = Math.floor(Math.random() * 19) + 1;

            if (!chooseMovie) {
                $("#movies-section").append($("<h5>").text("No movie was found. Try searching again or adjusting your parameters to describe a movie that actually exists"))
            }
            else {

                movieId = response.results[chooseMovie].id;
                movieSearch(movieId);
            }

        })
    }
}

// Searches for movie with certain actor when user inputs an actor
function actorSearch(actor, requestedGenre) {
    if (requestedRatings.length < 1) {
        $("#movies-section").append($("<h5>").text("Must allow for at least one rating"));
    }
    else {

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
                actorIdQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&with_genres=" + requestedGenre + "&with_cast=" + actorId + "&primary_release_date.gte=" + `${minYear}-01-01` + "&primary_release_date.lte=" + `${maxYear}-12-31` + "&certification_country=US&certification=" + ratingsQuery;

                console.log("ACTOR W/O GENRE" + actorIdQueryURL)
            }
            else {
                actorIdQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=bff2fb9d233724d8717a04b7589bf81d&with_cast=" + actorId + "&primary_release_date.gte=" + `${minYear}-01-01` + "&primary_release_date.lte=" + `${maxYear}-12-31` + "&certification_country=US&certification=" + ratingsQuery;

                console.log("ACTOR W/ GENRE" + actorIdQueryURL)
            }

            $.ajax({
                url: actorIdQueryURL,
                method: "GET",
            }).then(function (response) {
                console.log(response);

                var chooseMovie = Math.floor(Math.random() * response.results.length);

                console.log("Choose movie" + chooseMovie)

                if (!chooseMovie) {
                    $("#movies-section").text($("<h5>").text("No movie was found. Try searching again or adjusting your parameters to describe a movie that actually exists"))
                }
                else {

                    console.log(response.results, chooseMovie)

                    movieId = response.results[chooseMovie].id;

                    movieSearch(movieId);
                }


            })

        });
    }
};

// Searches for movies by the id returned from another function. Gets the values for all info displayed on webpage
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
            userSearch.push(movie);
            $(".searchHistory").empty()
            for (let i = userSearch.length - 1; i > userSearch.length - 6; i--){
                $(".searchHistory").append($("<li>").text(userSearch[i]))
            }
            localStorage.setItem("movieResults", JSON.stringify(userSearch))
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
}