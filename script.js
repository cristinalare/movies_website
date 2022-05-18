const tmdbKey = '9a482308981f947cef616bb16658fa83';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const searchBtn = document.querySelector('.search-btn');

const getGenres = async () => {
    const genreRequestEndpoint = '/genre/movie/list';
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;
  
    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.genres;
      }
    } catch(error) {
      console.log(error);
    }
};

const populateGenreDropdown = (genres) => {
    const select = document.getElementById('genres');

    for (const genre of genres) {
        let option = document.createElement("option");
        option.value = genre.id;
        option.text = genre.name;
        select.appendChild(option);
    }
};

const getSelectedGenre = () => {
    const selectedGenre = document.getElementById('genres').value;
    console.log(selectedGenre);
    return selectedGenre;
};

const getMovies = async () => {
    const selectedGenre = getSelectedGenre();
    const discoverMovieEndpoint = '/discover/movie';
    const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
    const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;
  
    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        const movies = jsonResponse.results;
        console.log(movies);
        return movies;
      }
    } catch(error) {
      console.log(error);
    }
  };
  
  const getMovieInfo = async movie => {
    const movieId = movie.id;
    const movieEndpoint = `/movie/${movieId}`;
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
  
    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const movieInfo = await response.json();
        return movieInfo;
      }
    } catch (error){
      console.log(error);
    }
  };
  
  const clearCurrentMovie = () => {
    const moviePosterDiv = document.querySelector('.movie-img');
    const movieTextDiv = document.querySelector('.movie-text');
    const movieInfo = document.querySelector('.movie-info');
    moviePosterDiv.innerHTML = '';
    movieTextDiv.innerHTML = '';
    movieInfo.style.minHeight = '80vh';
}

const getRandomMovie = (movies) => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    return randomMovie;
};

const createMoviePoster = (posterPath) => {
    const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;
    const posterImg = document.createElement('img');
    posterImg.setAttribute('src', moviePosterUrl);
    posterImg.setAttribute('id', 'moviePoster');
    return posterImg;
};

const createMovieTitle = (title) => {
    const titleHeader = document.createElement('h2');
    titleHeader.setAttribute('id', 'movieTitle');
    titleHeader.innerHTML = title;
    return titleHeader;
};

const createMovieOverview = (overview) => {
    const overviewParagraph = document.createElement('p');
    overviewParagraph.setAttribute('id', 'movieOverview');
    overviewParagraph.innerHTML = overview;
    return overviewParagraph;
};

const createMovieRating = (rating) => {
    const movieRating = document.createElement('p');
    movieRating.setAttribute('id', 'movieRating');
    movieRating.innerHTML = `Rating: ${rating}/10`;
    return movieRating;
};

const createMovieDate = (date) => {
    const movieDate = document.createElement('p');
    movieDate.setAttribute('id', 'movieDate');
    movieDate.innerHTML = `Release date: ${date}`;
    return movieDate;
}

const createMovieTime = (time) => {
    const movieTime = document.createElement('p');
    movieTime.setAttribute('id', 'movieTime');
    movieTime.innerHTML = `${time} mins`;
    return movieTime;
}

const createImdbLink = (imdb) => {
    const movieImdb = document.createElement('a');
    movieImdb.setAttribute('id', 'movieImdb');
    movieImdb.innerHTML = `See on IMBb`;
    const imdbLink = `https://www.imdb.com/title/${imdb}`;
    movieImdb.href = imdbLink;
    return movieImdb;
}

const showBtn = () => {
    const btnDiv = document.querySelector('.shuffle-btn');
    btnDiv.removeAttribute('hidden');
};

const shuffleMovie = () => {
    clearCurrentMovie();
    showRandomMovie();
};

const displayMovie = (movieInfo) => {
  const movieContainer = document.querySelector('.movie-section');
    const moviePosterDiv = document.querySelector('.movie-img');
    const movieTextDiv = document.querySelector('.movie-text');
    const shuffleBtn = document.querySelector('.shuffle-btn');
  
    const moviePoster = createMoviePoster(movieInfo.poster_path);
    const titleHeader = createMovieTitle(movieInfo.title);
    const movieTime = createMovieTime(movieInfo.runtime);
    const movieDate = createMovieDate(movieInfo.release_date);
    const overviewText = createMovieOverview(movieInfo.overview);
    const movieRating = createMovieRating(movieInfo.vote_average);
    const movieImdb = createImdbLink(movieInfo.imdb_id);
  
    moviePosterDiv.appendChild(moviePoster);
    movieTextDiv.appendChild(titleHeader);
    movieTextDiv.appendChild(movieTime);
    movieTextDiv.appendChild(movieDate);
    movieTextDiv.appendChild(movieRating);
    movieTextDiv.appendChild(overviewText);
    movieTextDiv.appendChild(movieImdb);
  
    movieContainer.style.display = 'block';
    showBtn();
    shuffleBtn.onclick = shuffleMovie;
};

const showRandomMovie = async () => {
    const movieInfo = document.querySelector('.movie-info');
    if (movieInfo.childNodes.length > 0) {
      clearCurrentMovie();
    };
    const movies = await getMovies();
    const randomMovie = getRandomMovie(movies);
    const info = await getMovieInfo(randomMovie);
    displayMovie(info);
};
  
var form = document.querySelector('.search-form');
function handleForm(event) { 
    event.preventDefault(); 
} 

const handleAnimation = () => {
  const header = document.querySelector('header');
  const searchSection = document.querySelector('.search-section');
  header.classList.add('main-animation-triggered');  
  searchSection.classList.add('main-animation-triggered'); 
}

const searchHandler = () => {
  handleAnimation();
  setTimeout(showRandomMovie, 400);
}

getGenres().then(populateGenreDropdown);
form.addEventListener('submit', handleForm);
// searchBtn.onclick = showRandomMovie;
// searchBtn.onclick = handleAnimation;
searchBtn.addEventListener('click', searchHandler);


